export enum BlockChainType {
  terra = 'terra',
  ethereum = 'ethereum',
  bsc = 'bsc',
  harmony = 'harmony',
}

export interface LocalTerraNetwork {
  /** Graphql server URL */
  mantle: string
  /** Ethereum */
  shuttle: Record<ShuttleNetwork, string>
}

export type ShuttleNetwork =
  | BlockChainType.ethereum
  | BlockChainType.bsc
  | BlockChainType.harmony

export interface ExtTerraNetwork {
  name: 'mainnet' | 'testnet'
  chainID: string
  lcd: string
  fcd: string
}
