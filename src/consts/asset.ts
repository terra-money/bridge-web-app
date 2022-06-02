import { AssetSymbolEnum, AssetNativeDenomEnum } from 'types/asset'

const TERRA_DECIMAL = 1e6
const BTC_DECIMAL = 1e8
const ETHER_BASE_DECIMAL = 1e18

const symbolOfDenom: Record<AssetNativeDenomEnum, AssetSymbolEnum> = {
  [AssetNativeDenomEnum.uluna]: AssetSymbolEnum.Luna,
}

const nativeDenoms = {
  [symbolOfDenom[AssetNativeDenomEnum.uluna]]: AssetNativeDenomEnum.uluna,
}

export default {
  nativeDenoms,
  symbolOfDenom,
  TERRA_DECIMAL,
  BTC_DECIMAL,
  ETHER_BASE_DECIMAL,
}
