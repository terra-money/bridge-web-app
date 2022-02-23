export enum BlockChainType {
  terra = 'terra',
  ethereum = 'ethereum',
  bsc = 'bsc',
  hmy = 'harmony',
  osmo = 'osmosis',
  cosmos = 'cosmos',
  cro = 'cronos',
  scrt = 'secret',
}

export type ShuttleNetwork =
  | BlockChainType.ethereum
  | BlockChainType.bsc
  | BlockChainType.hmy

export type IbcNetwork =
  | BlockChainType.osmo
  | BlockChainType.cosmos
  | BlockChainType.cro
  | BlockChainType.scrt

export function isIbcNetwork(network: BlockChainType): boolean {
  return [
    BlockChainType.osmo,
    BlockChainType.cosmos,
    BlockChainType.cro,
    BlockChainType.scrt,
  ].includes(network)
}

export const ibcChannels: Record<IbcNetwork, string> = {
  [BlockChainType.osmo]: 'channel-1',
  [BlockChainType.cosmos]: 'channel-2',
  [BlockChainType.cro]: 'channel-22',
  [BlockChainType.scrt]: 'channel-16',
}

export const ibcPrefix: Record<IbcNetwork, string> = {
  [BlockChainType.osmo]: 'osmo1',
  [BlockChainType.cosmos]: 'cosmos1',
  [BlockChainType.cro]: 'cro1',
  [BlockChainType.scrt]: 'secret1',
}

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

  ibc_tokens = '/ibc/tokens.json',
}
