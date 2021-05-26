export enum BlockChainType {
  terra = 'terra',
  ethereum = 'ethereum',
  bsc = 'bsc',
}

export interface LocalTerraNetwork {
  /** Graphql server URL */
  mantle: string
  /** Ethereum */
  shuttle: Record<ShuttleNetwork, string>
  lcd: string
  fcd: string
}

export type ShuttleNetwork = BlockChainType.ethereum | BlockChainType.bsc

export interface ExtTerraNetwork {
  name: 'mainnet' | 'testnet'
  chainID: string
}
