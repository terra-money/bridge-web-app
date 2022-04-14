import { Fee } from '@terra-money/terra.js'
import BigNumber from 'bignumber.js'
import { atom } from 'recoil'

import { AssetNativeDenomEnum, AssetType } from 'types/asset'
import { BlockChainType, BridgeType } from 'types/network'
import { ValidateResultType } from 'types/send'

// Send Data Start
const asset = atom<AssetType | undefined>({
  key: 'sendAsset',
  default: undefined,
})
const toAddress = atom<string>({
  key: 'sendToAddress',
  default: '',
})
const amount = atom<string>({
  key: 'sendAmount',
  default: '',
})
const memo = atom<string>({
  key: 'sendMemo',
  default: '',
})
const fromBlockChain = atom<BlockChainType>({
  key: 'sendFromBlockChain',
  default: BlockChainType.terra,
})
const toBlockChain = atom<BlockChainType>({
  key: 'sendToBlockChain',
  default: BlockChainType.ethereum,
})
const bridgeUsed = atom<BridgeType | undefined>({
  key: 'bridgeUsed',
  default: BridgeType.wormhole,
})
const fee = atom<Fee | undefined>({
  key: 'sendFee',
  default: undefined,
})
const gasPrices = atom<Record<string, string>>({
  key: 'sendGasPrices',
  default: {},
})
// Send Data End

const loginUserAssetList = atom<AssetType[]>({
  key: 'loginUserAssetList',
  default: [],
})

// Computed data from Send data Start
const feeDenom = atom<AssetNativeDenomEnum>({
  key: 'sendFeeDenom',
  default: AssetNativeDenomEnum.uusd,
})
const gasFeeList = atom<
  {
    denom: AssetNativeDenomEnum
    fee?: Fee
  }[]
>({
  key: 'sendGasFeeList',
  default: [],
})
const gasFee = atom<BigNumber>({
  key: 'sendGasFee',
  default: new BigNumber(0),
})
const bridgeFee = atom<BigNumber>({
  key: 'sendBridgeFee',
  default: new BigNumber(0),
})
const amountAfterBridgeFee = atom<BigNumber>({
  key: 'sendAmountAfterBridgeFee',
  default: new BigNumber(0),
})
// Computed data from Send data End

const validationResult = atom<ValidateResultType>({
  key: 'sendValidationResult',
  default: {
    isValid: false,
  },
})

export default {
  asset,
  toAddress,
  amount,
  memo,
  fromBlockChain,
  toBlockChain,
  bridgeUsed,
  fee,
  gasPrices,

  loginUserAssetList,
  feeDenom,
  gasFeeList,
  gasFee,
  bridgeFee,
  amountAfterBridgeFee,

  validationResult,
}
