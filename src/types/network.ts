import { AssetNativeDenomEnum } from './asset'

export enum BlockChainType {
  terra = 'terra',
  ethereum = 'ethereum',
  bsc = 'bsc',
  hmy = 'harmony',
  osmo = 'osmosis',
  scrt = 'secret',
  inj = 'injective',
  axelar = 'axelar',
  //cosmos = 'cosmos',
  //cro = 'cronos',
}

export type ShuttleNetwork =
  | BlockChainType.ethereum
  | BlockChainType.bsc
  | BlockChainType.hmy

export type IbcNetwork = 
  | BlockChainType.osmo 
  | BlockChainType.scrt
  | BlockChainType.inj
  | BlockChainType.axelar
//| BlockChainType.cosmos
//| BlockChainType.cro

export function isIbcNetwork(network: BlockChainType): boolean {
  return [
    BlockChainType.osmo,
    BlockChainType.scrt,
    BlockChainType.inj,
    BlockChainType.axelar,
//  BlockChainType.cosmos,
//  BlockChainType.cro,
  ].includes(network)
}

export const ibcChannels: Record<IbcNetwork, string> = {
  [BlockChainType.osmo]: 'channel-1',
  [BlockChainType.scrt]: 'channel-16',
  [BlockChainType.inj]: 'channel-17',
  [BlockChainType.axelar]: 'channel-19',
  //[BlockChainType.cosmos]: 'channel-2',
  //[BlockChainType.cro]: 'channel-22',
}

export const ibcPrefix: Record<IbcNetwork, string> = {
  [BlockChainType.osmo]: 'osmo1',
  [BlockChainType.scrt]: 'secret1',
  [BlockChainType.inj]: 'inj1',
  [BlockChainType.axelar]: 'axelar1',
  //[BlockChainType.cosmos]: 'cosmos1',
  //[BlockChainType.cro]: 'cro1',
}

export const allowedCoins: Record<IbcNetwork, string[]> = {
  [BlockChainType.osmo]: [
    AssetNativeDenomEnum.uusd,
    AssetNativeDenomEnum.uluna,
    AssetNativeDenomEnum.ukrw,
    'ibc/0471F1C4E7AFD3F07702BEF6DC365268D64570F7C1FDC98EA6098DD6DE59817B',
  ],
  [BlockChainType.scrt]: [
    AssetNativeDenomEnum.uusd,
    AssetNativeDenomEnum.uluna,
    'ibc/EB2CED20AB0466F18BE49285E56B31306D4C60438A022EA995BA65D5E3CF7E09',
  ],
  [BlockChainType.inj]: ['uusd', 'uluna'],
  [BlockChainType.axelar]: ['uusd', 'uluna'],
  //[BlockChainType.cosmos]: ['uusd', 'uluna'],
  //[BlockChainType.cro]: ['uusd', 'uluna'],
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
