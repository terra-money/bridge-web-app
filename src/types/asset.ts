export enum AssetNativeDenomEnum {
  ukrw = 'ukrw',
  uusd = 'uusd',
  uluna = 'uluna',
  usdr = 'usdr',
  umnt = 'umnt',
}

export enum AssetSymbolEnum {
  Luna = 'Luna',
  UST = 'UST',
  KRT = 'KRT',
  SDT = 'SDT',
  MNT = 'MNT',
  ANC = 'ANC',
  MIR = 'MIR',
  mAAPL = 'mAAPL',
  mGOOGL = 'mGOOGL',
  mTSLA = 'mTSLA',
  mNFLX = 'mNFLX',
  mQQQ = 'mQQQ',
  mTWTR = 'mTWTR',
  mMSFT = 'mMSFT',
  mAMZN = 'mAMZN',
  mBABA = 'mBABA',
  mIAU = 'mIAU',
  mSLV = 'mSLV',
  mUSO = 'mUSO',
  mVIXY = 'mVIXY',
  mFB = 'mFB',
  mCOIN = 'mCOIN',
}

export type AssetType = {
  symbol: AssetSymbolEnum
  name: string
  loguURI: string
  tokenAddress: string
  balance?: string
  disabled?: boolean
}

export type WhiteListType = Record<
  string, // symbol
  string // tokenAddress
>

export type BalanceListType = Record<
  string, // tokenAddress
  string // balance
>
