export enum BlockChainType {
  terra = 'terra',
  ethereum = 'ethereum',
  bsc = 'bsc',
  hmy = 'harmony',
}

export interface LocalTerraNetwork {
  /** Graphql server URL */
  mantle: string
  /** Ethereum */
  shuttle: Record<ShuttleNetwork, string>
  lcd: string
  fcd: string
}

export type ShuttleNetwork =
  | BlockChainType.ethereum
  | BlockChainType.bsc
  | BlockChainType.hmy

export interface ExtTerraNetwork {
  name: 'mainnet' | 'testnet'
  chainID: string
}
