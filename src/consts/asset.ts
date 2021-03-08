import { AssetType, AssetSymbolEnum, AssetNativeDenomEnum } from 'types/asset'

const TERRA_DECIMAL = 1e6
const ETHER_BASE_DECIMAL = 1e18

const symbolOfDenom: Record<AssetNativeDenomEnum, AssetSymbolEnum> = {
  [AssetNativeDenomEnum.ukrw]: AssetSymbolEnum.KRT,
  [AssetNativeDenomEnum.uusd]: AssetSymbolEnum.UST,
  [AssetNativeDenomEnum.uluna]: AssetSymbolEnum.LUNA,
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

const assetList: AssetType[] = [
  {
    symbol: AssetSymbolEnum.LUNA,
    name: 'Luna',
    loguURI: 'https://assets.terra.money/icon/60/Luna.png',
    tokenAddress: '',
  },
  {
    symbol: AssetSymbolEnum.UST,
    name: 'Terra USD',
    loguURI: 'https://assets.terra.money/icon/60/UST.png',
    tokenAddress: '',
  },
  {
    symbol: AssetSymbolEnum.KRT,
    name: 'Terra KRW',
    loguURI: 'https://assets.terra.money/icon/60/KRT.png',
    tokenAddress: '',
  },
  {
    symbol: AssetSymbolEnum.SDT,
    name: 'Terra SDR',
    loguURI: 'https://assets.terra.money/icon/60/SDT.png',
    tokenAddress: '',
  },
  {
    symbol: AssetSymbolEnum.MNT,
    name: 'Terra MNT',
    loguURI: 'https://assets.terra.money/icon/60/MNT.png',
    tokenAddress: '',
  },
  {
    symbol: AssetSymbolEnum.MIR,
    name: 'Mirror',
    loguURI: 'https://whitelist.mirror.finance/icon/MIR.png',
    tokenAddress: '',
  },
  {
    symbol: AssetSymbolEnum.mAAPL,
    name: 'Apple',
    loguURI: 'https://whitelist.mirror.finance/icon/AAPL.png',
    tokenAddress: '',
  },
  {
    symbol: AssetSymbolEnum.mGOOGL,
    name: 'Google',
    loguURI: 'https://whitelist.mirror.finance/icon/GOOGL.png',
    tokenAddress: '',
  },
  {
    symbol: AssetSymbolEnum.mTSLA,
    name: 'Tesla',
    loguURI: 'https://whitelist.mirror.finance/icon/TSLA.png',
    tokenAddress: '',
  },
  {
    symbol: AssetSymbolEnum.mNFLX,
    name: 'Netflix',
    loguURI: 'https://whitelist.mirror.finance/icon/NFLX.png',
    tokenAddress: '',
  },
  {
    symbol: AssetSymbolEnum.mQQQ,
    name: 'Invesco QQQ Trust',
    loguURI: 'https://whitelist.mirror.finance/icon/QQQ.png',
    tokenAddress: '',
  },
  {
    symbol: AssetSymbolEnum.mTWTR,
    name: 'Twitter',
    loguURI: 'https://whitelist.mirror.finance/icon/TWTR.png',
    tokenAddress: '',
  },
  {
    symbol: AssetSymbolEnum.mMSFT,
    name: 'Microsoft Corporation',
    loguURI: 'https://whitelist.mirror.finance/icon/MSFT.png',
    tokenAddress: '',
  },
  {
    symbol: AssetSymbolEnum.mAMZN,
    name: 'Amazon.com',
    loguURI: 'https://whitelist.mirror.finance/icon/AMZN.png',
    tokenAddress: '',
  },
  {
    symbol: AssetSymbolEnum.mBABA,
    name: 'Alibaba Group Holdings Ltd ADR',
    loguURI: 'https://whitelist.mirror.finance/icon/BABA.png',
    tokenAddress: '',
  },
  {
    symbol: AssetSymbolEnum.mIAU,
    name: 'iShares Gold Trust',
    loguURI: 'https://whitelist.mirror.finance/icon/IAU.png',
    tokenAddress: '',
  },
  {
    symbol: AssetSymbolEnum.mSLV,
    name: 'iShares Silver Trust',
    loguURI: 'https://whitelist.mirror.finance/icon/SLV.png',
    tokenAddress: '',
  },
  {
    symbol: AssetSymbolEnum.mUSO,
    name: 'United States Oil Fund, LP',
    loguURI: 'https://whitelist.mirror.finance/icon/USO.png',
    tokenAddress: '',
  },
  {
    symbol: AssetSymbolEnum.mVIXY,
    name: 'ProShares VIX',
    loguURI: 'https://whitelist.mirror.finance/icon/VIXY.png',
    tokenAddress: '',
  },
  {
    symbol: AssetSymbolEnum.mFB,
    name: 'Facebook Inc.',
    loguURI: 'https://whitelist.mirror.finance/icon/FB.png',
    tokenAddress: '',
  },
]
export default {
  assetList,
  nativeDenoms,
  symbolOfDenom,
  TERRA_DECIMAL,
  ETHER_BASE_DECIMAL,
}
