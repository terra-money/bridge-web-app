import { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import bech32 from 'bech32'
import axios from 'axios'
import {
  MsgSend,
  Coins,
  MsgExecuteContract,
  StdFee,
  LCDClient,
  Coin,
} from '@terra-money/terra.js'
import _ from 'lodash'
import BigNumber from 'bignumber.js'

import { UTIL } from 'consts'

import terraService from 'services/terraService'
import AuthStore from 'store/AuthStore'
import NetworkStore from 'store/NetworkStore'
import SendStore from 'store/SendStore'

import { BlockChainType } from 'types/network'
import { AssetNativeDenomEnum } from 'types/asset'
import { RequestTxResultType, EtherBaseReceiptResultType } from 'types/send'
import { WalletEnum } from 'types/wallet'

import useEtherBaseContract from './useEtherBaseContract'

export type TerraSendFeeInfo = {
  gasPrices: Record<string, string>
  fee: StdFee
  feeOfGas: BigNumber
}

type UseSendType = {
  initSendData: () => void
  submitRequestTx: () => Promise<RequestTxResultType>
  getTerraSendTax: (props: {
    denom: AssetNativeDenomEnum
    amount: string
    feeDenom: string
  }) => Promise<Coin | undefined>
  getTerraFeeList: () => Promise<
    {
      denom: AssetNativeDenomEnum
      fee?: StdFee
    }[]
  >
  getTerraMsgs: () => MsgSend[] | MsgExecuteContract[]
  waitForEtherBaseTransaction: (props: {
    hash: string
  }) => Promise<EtherBaseReceiptResultType | undefined>
}

/* bech32 */
const decodeTerraAddressOnEtherBase = (address: string): string => {
  try {
    const { words } = bech32.decode(address)
    const data = bech32.fromWords(words)
    return '0x' + Buffer.from(data).toString('hex')
  } catch (error) {
    return ''
  }
}

const useSend = (): UseSendType => {
  const loginUser = useRecoilValue(AuthStore.loginUser)
  const terraExt = useRecoilValue(NetworkStore.terraExt)
  const terraLocal = useRecoilValue(NetworkStore.terraLocal)

  const [gasPricesFromServer, setGasPricesFromServer] = useRecoilState(
    SendStore.gasPrices
  )

  // Send Data
  const [asset, setAsset] = useRecoilState(SendStore.asset)
  const [toAddress, setToAddress] = useRecoilState(SendStore.toAddress)
  const [sendAmount, setSendAmount] = useRecoilState(SendStore.amount)
  const [memo, setMemo] = useRecoilState(SendStore.memo)
  const [toBlockChain, setToBlockChain] = useRecoilState(SendStore.toBlockChain)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)
  const feeDenom = useRecoilValue<AssetNativeDenomEnum>(SendStore.feeDenom)
  const [fee, setFee] = useRecoilState(SendStore.fee)

  const { getEtherBaseContract } = useEtherBaseContract()

  const getGasPricesFromServer = async (): Promise<void> => {
    if (terraExt) {
      const { data } = await axios.get('/v1/txs/gas_prices', {
        baseURL: terraExt.fcd,
      })
      setGasPricesFromServer(data)
    }
  }

  useEffect(() => {
    getGasPricesFromServer()
  }, [terraExt])

  const initSendData = (): void => {
    setAsset(undefined)
    setToAddress('')
    setSendAmount('')
    setMemo('')
    setToBlockChain(BlockChainType.terra)

    setFee(undefined)
  }

  const getTerraSendTax = async (props: {
    denom: AssetNativeDenomEnum
    amount: string
    feeDenom: string
  }): Promise<Coin | undefined> => {
    const { denom, amount, feeDenom: _feeDenom } = props
    if (terraExt) {
      const lcd = new LCDClient({
        chainID: terraExt.chainID,
        URL: terraExt.lcd,
        gasPrices: { [_feeDenom]: gasPricesFromServer[_feeDenom] },
      })
      // tax
      return UTIL.isNativeTerra(denom)
        ? lcd.utils.calculateTax(new Coin(denom, amount))
        : new Coin(_feeDenom, 0)
    }
  }

  const getTerraFeeList = async (): Promise<
    {
      denom: AssetNativeDenomEnum
      fee?: StdFee
    }[]
  > => {
    if (terraExt) {
      const msgs = getTerraMsgs()

      return Promise.all(
        _.map(AssetNativeDenomEnum, async (denom) => {
          try {
            const lcd = new LCDClient({
              chainID: terraExt.chainID,
              URL: terraExt.lcd,
              gasPrices: { [denom]: gasPricesFromServer[denom] },
            })
            // fee + tax
            const unsignedTx = await lcd.tx.create(loginUser.address, {
              msgs,
              feeDenoms: [denom],
            })
            return {
              denom,
              fee: unsignedTx.fee,
            }
          } catch {
            return {
              denom,
            }
          }
        })
      )
    }
    return []
  }

  const getTerraMsgs = (): MsgSend[] | MsgExecuteContract[] => {
    if (asset) {
      const recipient =
        toBlockChain === BlockChainType.terra
          ? toAddress
          : terraLocal.shuttle[toBlockChain]

      return UTIL.isNativeDenom(asset.tokenAddress)
        ? [
            new MsgSend(loginUser.address, recipient, [
              new Coin(asset.tokenAddress, sendAmount),
            ]),
          ]
        : [
            new MsgExecuteContract(
              loginUser.address,
              asset.tokenAddress,
              { transfer: { recipient, amount: sendAmount } },
              new Coins([])
            ),
          ]
    }
    return []
  }

  const submitRequestTxFromTerra = async (): Promise<RequestTxResultType> => {
    const memoOrToAddress =
      toBlockChain === BlockChainType.terra
        ? // only terra network can get user's memo
          memo
        : // if send to ether-base then memo must be to-address
          toAddress
    const msgs = getTerraMsgs()
    const result = await terraService.post({
      msgs,
      memo: memoOrToAddress,
      gasPrices: { [feeDenom]: gasPricesFromServer[feeDenom] },
      fee,
    })

    if (result.success && result.result) {
      return {
        success: true,
        hash: result.result.txhash,
      }
    }

    return {
      success: false,
      errorMessage:
        result.error?.code === 1 ? 'Denied by the user' : result.error?.message,
    }
  }

  // function for 'submitRequestTxFromEtherBase'
  const handleTxErrorFromEtherBase = (error: any): RequestTxResultType => {
    if (loginUser.walletType === WalletEnum.Binance) {
      return {
        success: false,
        errorMessage: _.toString(error.error),
      }
    } else if (loginUser.walletType === WalletEnum.MetaMask) {
      return {
        success: false,
        errorMessage: error?.message,
      }
    }

    return {
      success: false,
      errorMessage: _.toString(error),
    }
  }

  // Can't send tx between Ethereum <-> BSC
  const submitRequestTxFromEtherBase = async (): Promise<RequestTxResultType> => {
    if (fromBlockChain !== BlockChainType.terra && asset?.tokenAddress) {
      const contract = getEtherBaseContract({ token: asset.tokenAddress })

      if (contract && loginUser.provider) {
        const signer = loginUser.provider.getSigner()
        const withSigner = contract.connect(signer)

        const isTerra = toBlockChain === BlockChainType.terra
        const decoded = decodeTerraAddressOnEtherBase(toAddress)
        try {
          const tx = isTerra
            ? withSigner.burn(sendAmount, decoded.padEnd(66, '0'))
            : withSigner.transfer(toAddress, sendAmount)

          const { hash } = await tx
          return { success: true, hash }
        } catch (error) {
          return handleTxErrorFromEtherBase(error)
        }
      }
    }

    return {
      success: false,
    }
  }

  const submitRequestTx = async (): Promise<RequestTxResultType> => {
    if (fromBlockChain === BlockChainType.terra) {
      return submitRequestTxFromTerra()
    }

    return submitRequestTxFromEtherBase()
  }

  const waitForEtherBaseTransaction = async ({
    hash,
  }: {
    hash: string
  }): Promise<EtherBaseReceiptResultType | undefined> => {
    if (fromBlockChain !== BlockChainType.terra && asset?.tokenAddress) {
      return loginUser.provider?.waitForTransaction(hash)
    }
  }

  return {
    initSendData,
    submitRequestTx,
    getTerraSendTax,
    getTerraFeeList,
    getTerraMsgs,
    waitForEtherBaseTransaction,
  }
}

export default useSend
