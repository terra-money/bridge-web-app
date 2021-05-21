import { AssetSymbolEnum, AssetNativeDenomEnum } from 'types/asset'

const TERRA_DECIMAL = 1e6
const ETHER_BASE_DECIMAL = 1e18

const symbolOfDenom: Record<AssetNativeDenomEnum, AssetSymbolEnum> = {
  [AssetNativeDenomEnum.ukrw]: AssetSymbolEnum.KRT,
  [AssetNativeDenomEnum.uusd]: AssetSymbolEnum.UST,
  [AssetNativeDenomEnum.uluna]: AssetSymbolEnum.Luna,
  [AssetNativeDenomEnum.usdr]: AssetSymbolEnum.SDT,
  [AssetNativeDenomEnum.umnt]: AssetSymbolEnum.MNT,
}

const terraDenoms = {
  [symbolOfDenom[AssetNativeDenomEnum.ukrw]]: AssetNativeDenomEnum.ukrw,
  [symbolOfDenom[AssetNativeDenomEnum.uusd]]: AssetNativeDenomEnum.uusd,
  [symbolOfDenom[AssetNativeDenomEnum.usdr]]: AssetNativeDenomEnum.usdr,
  [symbolOfDenom[AssetNativeDenomEnum.umnt]]: AssetNativeDenomEnum.umnt,
}

const nativeDenoms = {
  ...terraDenoms,
  [symbolOfDenom[AssetNativeDenomEnum.uluna]]: AssetNativeDenomEnum.uluna,
}

export default {
  nativeDenoms,
  symbolOfDenom,
  TERRA_DECIMAL,
  ETHER_BASE_DECIMAL,
}
