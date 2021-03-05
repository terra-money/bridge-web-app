import { StdFee } from '@terra-money/terra.js'
import BigNumber from 'bignumber.js'
import { atom } from 'recoil'
import { AssetNativeDenomEnum, AssetType } from 'types/asset'
import { BlockChainType } from 'types/network'

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
const toBlockChain = atom<BlockChainType>({
  key: 'sendToBlockChain',
  default: BlockChainType.terra,
})
const fee = atom<StdFee | undefined>({
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
const feeOfGas = atom<string>({
  key: 'sendFeeOfGas',
  default: '',
})
const tax = atom<string>({
  key: 'sendTax',
  default: '',
})
const shuttleFee = atom<BigNumber>({
  key: 'sendShuttleFee',
  default: new BigNumber(0),
})
const amountAfterShuttleFee = atom<BigNumber>({
  key: 'sendAmountAfterShuttleFee',
  default: new BigNumber(0),
})
// Computed data from Send data End

export default {
  asset,
  toAddress,
  amount,
  memo,
  toBlockChain,
  fee,
  gasPrices,

  loginUserAssetList,
  feeDenom,
  feeOfGas,
  tax,
  shuttleFee,
  amountAfterShuttleFee,
}
