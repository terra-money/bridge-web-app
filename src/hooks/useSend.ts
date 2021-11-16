import { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import bech32 from 'bech32'
import axios from 'axios'
import {
  MsgSend,
  Coins,
  MsgExecuteContract,
  Fee,
  LCDClient,
  Coin,
  CreateTxOptions,
} from '@terra-money/terra.js'
import _ from 'lodash'
import BigNumber from 'bignumber.js'
import { isMobile } from 'react-device-detect'
import { useQuery } from 'react-query'
import { useDebouncedCallback } from 'use-debounce/lib'

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
import ContractStore from 'store/ContractStore'
import useNetwork from './useNetwork'
import QueryKeysEnum from 'types/queryKeys'

export type TerraSendFeeInfo = {
  gasPrices: Record<string, string>
  fee: Fee
  feeOfGas: BigNumber
}

type AllowanceOfSelectedAssetType =
  | {
      isNeedApprove: true
      allowance: BigNumber
    }
  | {
      isNeedApprove: false
    }

type UseSendType = {
  allowanceOfSelectedAsset: AllowanceOfSelectedAssetType
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
      fee?: Fee
    }[]
  >
  getTerraMsgs: () => MsgSend[] | MsgExecuteContract[]
  waitForEtherBaseTransaction: (props: {
    hash: string
  }) => Promise<EtherBaseReceiptResultType | undefined>
  approveTxFromEtherBase: () => Promise<RequestTxResultType>
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

  const etherVaultTokenList = useRecoilValue(ContractStore.etherVaultTokenList)

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

  const { fromTokenAddress } = useNetwork()

  const {
    data: allowanceOfSelectedAsset = {
      isNeedApprove: false,
    },
    refetch: refetchAllowanceOfSelectedAsset,
  } = useQuery<AllowanceOfSelectedAssetType>(
    [
      QueryKeysEnum.allowanceOfSelectedAsset,
      fromBlockChain,
      asset,
      fromTokenAddress,
    ],
    async (): Promise<AllowanceOfSelectedAssetType> => {
      if (
        fromBlockChain !== BlockChainType.terra &&
        asset &&
        fromTokenAddress
      ) {
        const contract = getEtherBaseContract({ token: fromTokenAddress })

        if (contract && loginUser.provider) {
          const signer = loginUser.provider.getSigner()
          const withSigner = contract.connect(signer)
          const etherVaultToken = etherVaultTokenList[asset.terraToken]
          if (etherVaultToken) {
            const res: BigNumber = await withSigner.allowance(
              loginUser.address,
              etherVaultToken.vault
            )

            return {
              isNeedApprove: true,
              allowance: UTIL.toBignumber(res.toString()),
            }
          }
        }
      }
      return {
        isNeedApprove: false,
      }
    }
  )

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
      fee?: Fee
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
            feeDenoms = [ownedAssetList[0].terraToken as AssetNativeDenomEnum]
          } else {
            const target = ownedAssetList.find(
              (x) => x.terraToken !== asset?.terraToken
            )
            if (target) {
              feeDenoms = [target.terraToken as AssetNativeDenomEnum]
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
        const unsignedTx = await lcd.tx.create(
          [{ address: loginUser.address }],
          {
            msgs,
            feeDenoms,
          }
        )

        gas = unsignedTx.auth_info.fee.gas_limit
      } catch {
        // gas is just default value
      }

      return _.map(AssetNativeDenomEnum, (denom) => {
        const amount = new BigNumber(gasPricesFromServer[denom])
          .multipliedBy(gas)
          .dp(0, BigNumber.ROUND_UP)
          .toString(10)
        const gasFee = new Coins({ [denom]: amount })
        const fee = new Fee(gas, gasFee)
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
      const recipient =
        toBlockChain === BlockChainType.terra
          ? toAddress
          : terraLocal.shuttle[toBlockChain]

      if (
        etherVaultTokenList[asset.terraToken] &&
        toBlockChain === BlockChainType.ethereum
      ) {
        return [
          new MsgExecuteContract(
            loginUser.address,
            asset.terraToken,
            { burn: { amount: sendAmount } },
            new Coins([])
          ),
        ]
      }

      return UTIL.isNativeDenom(asset.terraToken)
        ? [
            new MsgSend(loginUser.address, recipient, [
              new Coin(asset.terraToken, sendAmount),
            ]),
          ]
        : [
            new MsgExecuteContract(
              loginUser.address,
              asset.terraToken,
              { transfer: { recipient, amount: sendAmount } },
              new Coins([])
            ),
          ]
    }
    return []
  }

  const submitRequestTxFromTerra = async (): Promise<RequestTxResultType> => {
    let errorMessage
    const memoOrToAddress =
      toBlockChain === BlockChainType.terra
        ? // only terra network can get user's memo
          memo
        : // if send to ether-base then memo must be to-address
          toAddress
    const msgs = getTerraMsgs()
    const txFee =
      tax?.amount.greaterThan(0) && fee
        ? new Fee(fee.gas_limit, fee.amount.add(tax))
        : fee
    const tx: CreateTxOptions = {
      gasPrices: [new Coin(feeDenom, gasPricesFromServer[feeDenom])],
      msgs,
      fee: txFee,
      memo: memoOrToAddress,
    }
    const connector = loginUser.terraWalletConnect
    if (connector) {
      const sendId = Date.now()
      const serializedTxOptions = {
        msgs: tx.msgs.map((msg) => msg.toJSON()),
        fee: tx.fee?.toJSON(),
        memo: tx.memo,
        gasPrices: tx.gasPrices?.toString(),
        gasAdjustment: tx.gasAdjustment?.toString(),
        feeDenoms: tx.feeDenoms,
      }

      if (isMobile) {
        const payload = btoa(
          JSON.stringify({
            id: sendId,
            handshakeTopic: connector.handshakeTopic,
            params: serializedTxOptions,
          })
        )
        window.location.href = `terrastation://walletconnect_confirm/?payload=${payload}`
      }
      try {
        const result = await connector.sendCustomRequest({
          id: sendId,
          method: 'post',
          params: [serializedTxOptions],
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
    let errorMessage = _.toString(error)
    if (loginUser.walletType === WalletEnum.Binance) {
      errorMessage = _.toString(error.error)
    } else if (loginUser.walletType === WalletEnum.MetaMask) {
      errorMessage = error?.message
    }

    return {
      success: false,
      errorMessage,
    }
  }

  const approveTxFromEtherBase = async (): Promise<RequestTxResultType> => {
    if (fromBlockChain !== BlockChainType.terra && asset && fromTokenAddress) {
      const contract = getEtherBaseContract({ token: fromTokenAddress })

      if (contract && loginUser.provider) {
        const signer = loginUser.provider.getSigner()
        const withSigner = contract.connect(signer)

        try {
          const etherVaultToken = etherVaultTokenList[asset.terraToken]

          const { hash } = await withSigner.approve(
            etherVaultToken.vault,
            sendAmount
          )

          await waitForEtherBaseTransaction({
            hash,
          })
          refetchAllowanceOfSelectedAsset()

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

  // Can't send tx between Ethereum <-> BSC
  const submitRequestTxFromEtherBase =
    async (): Promise<RequestTxResultType> => {
      if (
        fromBlockChain !== BlockChainType.terra &&
        asset &&
        fromTokenAddress
      ) {
        const contract = getEtherBaseContract({ token: fromTokenAddress })

        if (contract && loginUser.provider) {
          const signer = loginUser.provider.getSigner()
          const withSigner = contract.connect(signer)

          const isTerra = toBlockChain === BlockChainType.terra
          const decoded = decodeTerraAddressOnEtherBase(toAddress)
          try {
            const etherVaultToken = etherVaultTokenList[asset.terraToken]

            if (etherVaultToken && fromBlockChain === BlockChainType.ethereum) {
              const vaultContract = getEtherBaseContract({
                token: etherVaultToken.vault,
              })!
              const vaultContractSigner = vaultContract.connect(signer)

              const tx = isTerra
                ? vaultContractSigner?.burn(sendAmount, decoded.padEnd(66, '0'))
                : withSigner.transfer(toAddress, sendAmount)

              const { hash } = await tx
              return { success: true, hash }
            } else {
              const tx = isTerra
                ? withSigner.burn(sendAmount, decoded.padEnd(66, '0'))
                : withSigner.transfer(toAddress, sendAmount)

              const { hash } = await tx
              return { success: true, hash }
            }
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
    if (fromBlockChain !== BlockChainType.terra && asset?.terraToken) {
      return loginUser.provider?.waitForTransaction(hash)
    }
  }

  return {
    allowanceOfSelectedAsset,
    initSendData,
    submitRequestTx,
    getTerraSendTax,
    getTerraFeeList,
    getTerraMsgs,
    waitForEtherBaseTransaction,
    approveTxFromEtherBase,
  }
}

export default useSend
