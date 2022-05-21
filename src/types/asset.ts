export enum AssetNativeDenomEnum {
  uluna = 'uluna',
}

export enum AssetSymbolEnum {
  Luna = 'Luna',
}

export type AssetType = {
  symbol: AssetSymbolEnum
  name: string
  logoURI: string
  terraToken: string
  balance?: string
  disabled?: boolean
}

export type WhiteListType = Record<
  string, // terra tokenAddress
  string // tokenAddress
>

export type BalanceListType = Record<
  string, // tokenAddress
  string // balance
>
