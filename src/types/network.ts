export enum BlockChainType {
  terra = 'terra',
  ethereum = 'ethereum',
  bsc = 'bsc',
  secret = 'secret',
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
  | BlockChainType.secret

export interface ExtTerraNetwork {
  name: 'mainnet' | 'testnet'
  chainID: string
}

export interface LocalSecretNetwork {
  bridge: string
  chainID: string
  apiUrl: string
}
