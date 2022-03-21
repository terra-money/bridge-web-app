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
  MsgTransfer,
} from '@terra-money/terra.js'
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx.js'
import { getInjectiveSequence } from 'packages/injective'
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

import {
  BlockChainType,
  ShuttleNetwork,
  isIbcNetwork,
  terraIbcChannels,
  ibcChannels,
  IbcNetwork,
  ibcChainId,
  isAxelarNetwork,
} from 'types/network'
import { AssetNativeDenomEnum } from 'types/asset'
import { RequestTxResultType, EtherBaseReceiptResultType } from 'types/send'
import { WalletEnum } from 'types/wallet'

import useEtherBaseContract from './useEtherBaseContract'
import ContractStore from 'store/ContractStore'
import useNetwork from './useNetwork'
import QueryKeysEnum from 'types/queryKeys'
import { getDepositAddress as getAxelarAddress } from 'packages/axelar/getDepositAddress'
import useTns from 'packages/tns/useTns'

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
  getTerraFeeList: () => Promise<
    {
      denom: AssetNativeDenomEnum
      fee?: Fee
    }[]
  >
  getTerraMsgs: () => Promise<MsgSend[] | MsgExecuteContract[] | MsgTransfer[]>
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
  const assetList = useRecoilValue(SendStore.loginUserAssetList)

  const { getEtherBaseContract } = useEtherBaseContract()

  const { fromTokenAddress } = useNetwork()
  const { getAddress } = useTns()

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

        const msgs = await getTerraMsgs(true)
        const lcd = new LCDClient({
          chainID: terraExt.chainID,
          URL: terraLocal.lcd,
          gasPrices: gasPricesFromServer,
        })
        // fee
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

  const getTerraMsgs = async (
    isSimulation?: boolean
  ): Promise<MsgSend[] | MsgExecuteContract[] | MsgTransfer[]> => {
    if (asset) {
      const recipient =
        toBlockChain === BlockChainType.terra
          ? (await getAddress(toAddress)) || toAddress
          : terraLocal.shuttle[toBlockChain as ShuttleNetwork]

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

      if (
        (UTIL.isNativeDenom(asset.terraToken) ||
          asset.terraToken.startsWith('ibc/')) &&
        isIbcNetwork(toBlockChain)
      ) {
        return [
          new MsgTransfer(
            'transfer',
            terraIbcChannels[toBlockChain as IbcNetwork],
            new Coin(asset.terraToken, sendAmount),
            loginUser.address,
            toAddress,
            undefined,
            (Date.now() + 120 * 1000) * 1e6
          ),
        ]
      }

      if (
        UTIL.isNativeDenom(asset.terraToken) &&
        isAxelarNetwork(toBlockChain)
      ) {
        // in the fee simulation use the user address
        const axelarAddress = isSimulation
          ? loginUser.address
          : await getAxelarAddress(
              toAddress,
              toBlockChain as 'avalanche' | 'fantom',
              asset.terraToken as 'uusd' | 'uluna'
            )

        return [
          new MsgTransfer(
            'transfer',
            terraIbcChannels[BlockChainType.axelar],
            new Coin(asset.terraToken, sendAmount),
            loginUser.address,
            axelarAddress || '',
            undefined,
            (Date.now() + 300 * 1000) * 1e6
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
    const msgs = await getTerraMsgs()

    const tx: CreateTxOptions = {
      gasPrices: [new Coin(feeDenom, gasPricesFromServer[feeDenom])],
      msgs,
      fee,
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
      const terraAddress = (await getAddress(toAddress)) || toAddress
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
          const decoded = decodeTerraAddressOnEtherBase(terraAddress)
          try {
            const etherVaultToken = etherVaultTokenList[asset.terraToken]

            if (etherVaultToken && fromBlockChain === BlockChainType.ethereum) {
              const vaultContract = getEtherBaseContract({
                token: etherVaultToken.vault,
              })!
              const vaultContractSigner = vaultContract.connect(signer)

              const tx = isTerra
                ? vaultContractSigner?.burn(sendAmount, decoded.padEnd(66, '0'))
                : withSigner.transfer(terraAddress, sendAmount)

              const { hash } = await tx
              return { success: true, hash }
            } else {
              const tx = isTerra
                ? withSigner.burn(sendAmount, decoded.padEnd(66, '0'))
                : withSigner.transfer(terraAddress, sendAmount)

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

  const handleTxErrorFromIbc = (error: any): RequestTxResultType => {
    let errorMessage = _.toString(error)
    return {
      success: false,
      errorMessage,
    }
  }

  const submitRequestTxFromIbc = async (): Promise<RequestTxResultType> => {
    if (
      isIbcNetwork(fromBlockChain) &&
      asset &&
      fromTokenAddress &&
      toBlockChain === BlockChainType.terra
    ) {
      if (loginUser.signer) {
        try {
          const terraAddress = (await getAddress(toAddress)) || toAddress

          await window.keplr.enable(ibcChainId[fromBlockChain as IbcNetwork])

          const transferMsg = {
            typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
            value: {
              sourcePort: 'transfer',
              sourceChannel: ibcChannels[fromBlockChain as IbcNetwork],
              sender: loginUser.address,
              receiver: terraAddress,
              token: { denom: fromTokenAddress, amount: sendAmount },
              timeoutHeight: undefined,
              timeoutTimestamp: (Date.now() + 120 * 1000) * 1e6,
            },
          }

          let account
          if (fromBlockChain === BlockChainType.inj) {
            account = await getInjectiveSequence(loginUser.address)
          } else {
            account = await loginUser.signer.getSequence(loginUser.address)
          }

          const tx = await loginUser.signer.sign(
            loginUser.address,
            [transferMsg],
            {
              amount: [],
              gas: fromBlockChain === BlockChainType.inj ? '150000' : '100000',
            },
            '', // memo
            {
              chainId: ibcChainId[fromBlockChain as IbcNetwork],
              accountNumber: account.accountNumber,
              sequence: account.sequence,
            }
          )

          const { code, transactionHash } = await loginUser.signer.broadcastTx(
            TxRaw.encode(tx).finish()
          )
          return { success: code === 0, hash: transactionHash }
        } catch (error) {
          console.error(error)
          return handleTxErrorFromIbc(error)
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
    if (isIbcNetwork(fromBlockChain)) {
      return submitRequestTxFromIbc()
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
    getTerraFeeList,
    getTerraMsgs,
    waitForEtherBaseTransaction,
    approveTxFromEtherBase,
  }
}

export default useSend
