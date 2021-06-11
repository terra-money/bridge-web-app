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
  CreateTxOptions,
} from '@terra-money/terra.js'
import _ from 'lodash'
import BigNumber from 'bignumber.js'
import { isMobile } from 'react-device-detect'

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
import { useDebouncedCallback } from 'use-debounce/lib'

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
  const keplrLocal = useRecoilValue(NetworkStore.keplrLocal)

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
  const tax = useRecoilValue(SendStore.tax)
  const assetList = useRecoilValue(SendStore.loginUserAssetList)

  const { getEtherBaseContract } = useEtherBaseContract()

  const getGasPricesFromServer = useDebouncedCallback(
    async (fcd): Promise<void> => {
      const { data } = await axios.get('/v1/txs/gas_prices', {
        baseURL: fcd,
      })
      setGasPricesFromServer(data)
    },
    300
  )

  useEffect(() => {
    getGasPricesFromServer.callback(terraLocal.fcd)
    return (): void => {
      getGasPricesFromServer.cancel()
    }
  }, [terraLocal.fcd])

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
        URL: terraLocal.lcd,
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
      let gas = 200000
      try {
        let feeDenoms = [AssetNativeDenomEnum.uusd]
        const ownedAssetList = assetList.filter(
          (x) => _.toNumber(x.balance) > 0
        )

        if (ownedAssetList.length > 0) {
          if (ownedAssetList.length === 1) {
            feeDenoms = [ownedAssetList[0].tokenAddress as AssetNativeDenomEnum]
          } else {
            const target = ownedAssetList.find(
              (x) => x.tokenAddress !== asset?.tokenAddress
            )
            if (target) {
              feeDenoms = [target.tokenAddress as AssetNativeDenomEnum]
            }
          }
        }

        const msgs = getTerraMsgs()
        const lcd = new LCDClient({
          chainID: terraExt.chainID,
          URL: terraLocal.lcd,
          gasPrices: gasPricesFromServer,
        })
        // fee + tax
        const unsignedTx = await lcd.tx.create(loginUser.address, {
          msgs,
          feeDenoms,
        })

        gas = unsignedTx.fee.gas
      } catch {
        // gas is just default value
      }

      return _.map(AssetNativeDenomEnum, (denom) => {
        const amount = new BigNumber(gasPricesFromServer[denom])
          .multipliedBy(gas)
          .dp(0, BigNumber.ROUND_UP)
          .toString(10)
        const gasFee = new Coins({ [denom]: amount })
        const fee = new StdFee(gas, gasFee)
        return {
          denom,
          fee,
        }
      })
    }
    return []
  }

  const getTerraMsgs = (): MsgSend[] | MsgExecuteContract[] => {
    if (asset) {
      if (toBlockChain === BlockChainType.secret) {
        return UTIL.isNativeDenom(asset.tokenAddress)
          ? [
              new MsgExecuteContract(
                loginUser.address, // sender
                terraLocal.shuttle[toBlockChain], // contract account address
                {
                  receive: { msg: btoa(toAddress) },
                }, // handle msg
                [new Coin(asset.tokenAddress, sendAmount)] // coins
              ),
            ]
          : [
              new MsgExecuteContract(
                loginUser.address, // sender
                asset.tokenAddress, // contract account address
                {
                  // handle msg
                  send: {
                    contract: terraLocal.shuttle[toBlockChain],
                    amount: sendAmount,
                    msg: btoa(toAddress),
                  },
                },
                new Coins([])
              ),
            ]
      } else {
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
    }
    return []
  }

  const getCreateTxOptions = (): CreateTxOptions => {
    const msgs = getTerraMsgs()
    const txFee =
      tax?.amount.greaterThan(0) && fee
        ? new StdFee(fee.gas, fee.amount.add(tax))
        : fee
    if (toBlockChain === BlockChainType.secret) {
      return {
        gasPrices: [new Coin(feeDenom, gasPricesFromServer[feeDenom])],
        msgs,
        fee: txFee,
      }
    } else {
      const memoOrToAddress =
        toBlockChain === BlockChainType.terra
          ? // only terra network can get user's memo
            memo
          : // if send to ether-base then memo must be to-address
            toAddress

      return {
        gasPrices: [new Coin(feeDenom, gasPricesFromServer[feeDenom])],
        msgs,
        fee: txFee,
        memo: memoOrToAddress,
      }
    }
  }

  const submitRequestTxFromTerra = async (): Promise<RequestTxResultType> => {
    let errorMessage

    const tx: CreateTxOptions = getCreateTxOptions()

    const connector = loginUser.walletConnect

    if (connector) {
      const sendId = Date.now()
      const params = [
        {
          msgs: tx.msgs.map((msg) => msg.toJSON()),
          fee: tx.fee?.toJSON(),
          memo: tx.memo,
          gasPrices: tx.gasPrices?.toString(),
          gasAdjustment: tx.gasAdjustment?.toString(),
          account_number: tx.account_number,
          sequence: tx.sequence,
          feeDenoms: tx.feeDenoms,
        },
      ]

      if (isMobile) {
        window.location.href = `terrastation://wallet_connect_confirm?id=${sendId}&handshakeTopic=${
          connector.handshakeTopic
        }&params=${JSON.stringify(params)}`
      }
      try {
        const result = await connector.sendCustomRequest({
          id: sendId,
          method: 'post',
          params,
        })
        return {
          success: true,
          hash: result.txhash,
        }
      } catch (error) {
        const jsonMsg = UTIL.jsonTryParse<{
          id: number
          errorCode?: number
          message: string
          txHash?: string
          raw_message?: any
        }>(error.message)
        const errorMessage = jsonMsg?.message || _.toString(error)
        return {
          success: false,
          errorMessage,
        }
      }
    } else {
      const result = await terraService.post(tx)

      if (result.success && result.result) {
        return {
          success: true,
          hash: result.result.txhash,
        }
      }
      errorMessage =
        result.error?.code === 1 ? 'Denied by the user' : result.error?.message
    }

    return {
      success: false,
      errorMessage,
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

  const submitRequestTxFromSecretNetwork = async (): Promise<RequestTxResultType> => {
    if (asset?.tokenAddress) {
      const MSG = btoa(toAddress)

      const result = await loginUser.signingCosmWasmClient?.execute(
        asset.tokenAddress,
        {
          send: {
            recipient: keplrLocal?.bridge,
            amount: sendAmount,
            msg: MSG,
          },
        },
        '',
        []
      )

      return {
        success: true,
        hash: result?.transactionHash || '',
      }
    }

    return {
      success: false,
    }
  }

  const submitRequestTx = async (): Promise<RequestTxResultType> => {
    if (fromBlockChain === BlockChainType.terra) {
      return submitRequestTxFromTerra()
    } else if (fromBlockChain === BlockChainType.secret) {
      return submitRequestTxFromSecretNetwork()
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
