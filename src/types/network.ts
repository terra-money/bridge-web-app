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
  avalanche = 'avalanche',
  fantom = 'fantom',
  cosmos = 'cosmos',
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
  | BlockChainType.cosmos
//| BlockChainType.cro

export type AxelarNetwork = BlockChainType.avalanche | BlockChainType.fantom

export function isIbcNetwork(network: BlockChainType): boolean {
  return [
    BlockChainType.osmo,
    BlockChainType.scrt,
    BlockChainType.inj,
    BlockChainType.axelar,
    BlockChainType.cosmos,
    //  BlockChainType.cro,
  ].includes(network)
}

export function isAxelarNetwork(network: BlockChainType): boolean {
  return [BlockChainType.avalanche, BlockChainType.fantom].includes(network)
}

// channels Terra -> IBC chain
export const terraIbcChannels: Record<IbcNetwork, string> = {
  [BlockChainType.osmo]: 'channel-1',
  [BlockChainType.scrt]: 'channel-16',
  [BlockChainType.inj]: 'channel-17',
  [BlockChainType.axelar]: 'channel-19',
  [BlockChainType.cosmos]: 'channel-41',
  //[BlockChainType.cro]: 'channel-22',
}

// channels IBC chain -> Terra
export const ibcChannels: Record<IbcNetwork, string> = {
  [BlockChainType.osmo]: 'channel-72',
  [BlockChainType.scrt]: 'channel-2',
  [BlockChainType.inj]: 'channel-4',
  [BlockChainType.axelar]: 'channel-0',
  [BlockChainType.cosmos]: 'channel-299',
  //[BlockChainType.cro]: '',
}

export const ibcPrefix: Record<IbcNetwork, string> = {
  [BlockChainType.osmo]: 'osmo1',
  [BlockChainType.scrt]: 'secret1',
  [BlockChainType.inj]: 'inj1',
  [BlockChainType.axelar]: 'axelar1',
  [BlockChainType.cosmos]: 'cosmos1',
  //[BlockChainType.cro]: 'cro1',
}

export const ibcChainId: Record<IbcNetwork, string> = {
  [BlockChainType.osmo]: 'osmosis-1',
  [BlockChainType.scrt]: 'secret-4',
  [BlockChainType.inj]: 'injective-1',
  [BlockChainType.axelar]: 'axelar-dojo-1',
  [BlockChainType.cosmos]: 'cosmoshub-4',
  //[BlockChainType.cro]: 'crypto-org-chain-mainnet-1',
}

export const ibcRpc: Record<IbcNetwork, string> = {
  [BlockChainType.osmo]: 'https://rpc-osmosis.blockapsis.com/',
  [BlockChainType.scrt]: 'https://lcd-secret.scrtlabs.com/rpc/',
  [BlockChainType.inj]: 'https://tm.injective.network/',
  [BlockChainType.axelar]: 'https://axelar-rpc.quickapi.com/',
  [BlockChainType.cosmos]: 'https://cosmoshub.validator.network/',
  //[BlockChainType.cro]: '',
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
  [BlockChainType.inj]: [AssetNativeDenomEnum.uusd, AssetNativeDenomEnum.uluna],
  [BlockChainType.axelar]: [
    AssetNativeDenomEnum.uusd,
    AssetNativeDenomEnum.uluna,
  ],
  [BlockChainType.cosmos]: [
    AssetNativeDenomEnum.uusd,
    AssetNativeDenomEnum.uluna,
    'ibc/18ABA66B791918D51D33415DA173632735D830E2E77E63C91C11D3008CFD5262',
  ],
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
  osmo_tokens = '/ibc/osmo.json',
  scrt_tokens = '/ibc/scrt.json',
  axelar_tokens = '/ibc/axelar.json',
  inj_tokens = '/ibc/inj.json',
  cosmos_tokens = '/ibc/cosmos.json',

  avalanche_tokens = '/ibc/axelar/avalanche.json',
  fantom_tokens = '/ibc/axelar/fantom.json',
}
