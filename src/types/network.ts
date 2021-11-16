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
  name: TerraNetworkEnum
  chainID: string
  mantle: string
  lcd: string
  fcd: string
  walletconnectID: number
}

export interface LocalTerraNetwork extends ExtTerraNetwork {
  shuttle: Record<ShuttleNetwork, string>
}

export enum TerraNetworkEnum {
  mainnet = 'mainnet',
  testnet = 'testnet',
}

export enum TerraAssetsPathEnum {
  station_maintenamce = '/station/maintenance.json',

  chains = '/chains.json',

  cw20_pairs = '/cw20/pairs.json',
  cw20_tokens = '/cw20/tokens.json',

  shuttle_eth = '/shuttle/eth.json',
  shuttle_bsc = '/shuttle/bsc.json',
  shuttle_hmy = '/shuttle/hmy.json',
}
