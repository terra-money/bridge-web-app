import { useEffect, useState } from 'react'
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
  tax: Coin
  feeOfGas: Coin
}

type UseSendType = {
  initSendData: () => void
  submitRequestTx: () => Promise<RequestTxResultType>
  getTerraSendFeeInfo: (props: {
    denom: AssetNativeDenomEnum
    amount: string
    msgs: MsgSend[] | MsgExecuteContract[]
    feeDenom: string
  }) => Promise<TerraSendFeeInfo | undefined>
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

  const [gasPricesFromServer, setGasPricesFromServer] = useState<
    Record<string, string>
  >({})

  // Send Data
  const [asset, setAsset] = useRecoilState(SendStore.asset)
  const [toAddress, setToAddress] = useRecoilState(SendStore.toAddress)
  const [sendAmount, setSendAmount] = useRecoilState(SendStore.amount)
  const [memo, setMemo] = useRecoilState(SendStore.memo)
  const [toBlockChain, setToBlockChain] = useRecoilState(SendStore.toBlockChain)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)

  const [gasPrices, setGasPrices] = useRecoilState(SendStore.gasPrices)
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

    setGasPrices({})
    setFee(undefined)
  }

  const getTerraSendFeeInfo = async ({
    denom,
    amount,
    msgs,
    feeDenom,
  }: {
    denom: AssetNativeDenomEnum
    amount: string
    msgs: MsgSend[] | MsgExecuteContract[]
    feeDenom: string
  }): Promise<TerraSendFeeInfo | undefined> => {
    if (terraExt) {
      const lcd = new LCDClient({
        chainID: terraExt.chainID,
        URL: terraExt.lcd,
        gasPrices: { [feeDenom]: gasPricesFromServer[feeDenom] },
      })

      // tax
      const tax = UTIL.isNativeTerra(denom)
        ? await lcd.utils.calculateTax(new Coin(denom, amount))
        : new Coin(feeDenom, 0)

      // fee + tax
      const unsignedTx = await lcd.tx.create(loginUser.address, {
        msgs,
        feeDenoms: [feeDenom],
      })

      return {
        gasPrices: { [feeDenom]: gasPricesFromServer[feeDenom] },
        fee: unsignedTx.fee,
        tax,
        feeOfGas: unsignedTx.fee.amount.toArray()[0],
      }
    }
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
      gasPrices,
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
    getTerraSendFeeInfo,
    getTerraMsgs,
    waitForEtherBaseTransaction,
  }
}

export default useSend
