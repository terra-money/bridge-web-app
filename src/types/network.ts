export enum BlockChainType {
  terra = 'terra',
  ethereum = 'ethereum',
  bsc = 'bsc',
  hmy = 'harmony',
}

export type ShuttleNetwork =
  | BlockChainType.ethereum
  | BlockChainType.bsc
  | BlockChainType.hmy

export interface ExtTerraNetwork {
  name: TerraNetworkNameEnum
  chainID: string
  mantle: string
  lcd: string
  fcd: string
  walletconnectID: number
}

export interface LocalTerraNetwork extends ExtTerraNetwork {
  shuttle: Record<ShuttleNetwork, string>
}

export enum TerraNetworkNameEnum {
  mainnet = 'mainnet',
  testnet = 'testnet',
  bombay = 'bombay',
}
