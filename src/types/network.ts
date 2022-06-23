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
  polygon = 'polygon',
  moonbeam = 'moonbeam',
  //cro = 'cronos',
}

export enum BridgeType {
  shuttle = 'shuttle',
  wormhole = 'wormhole',
  ibc = 'ibc',
  axelar = 'axelar',
}

export const availableBridges: Record<BlockChainType, BridgeType[]> = {
  [BlockChainType.osmo]: [BridgeType.ibc],
  [BlockChainType.scrt]: [BridgeType.ibc],
  [BlockChainType.inj]: [BridgeType.ibc],
  [BlockChainType.axelar]: [BridgeType.ibc],
  [BlockChainType.cosmos]: [BridgeType.ibc],
  [BlockChainType.ethereum]: [BridgeType.wormhole, BridgeType.shuttle],
  [BlockChainType.bsc]: [BridgeType.wormhole, BridgeType.shuttle],
  [BlockChainType.hmy]: [BridgeType.shuttle],
  [BlockChainType.avalanche]: [BridgeType.wormhole],
  [BlockChainType.fantom]: [BridgeType.wormhole],
  [BlockChainType.polygon]: [BridgeType.wormhole],
  [BlockChainType.moonbeam]: [],
  [BlockChainType.terra]: [],
}

export function getDefaultBridge(
  from: BlockChainType,
  to: BlockChainType
): BridgeType | undefined {
  const chain = from === BlockChainType.terra ? to : from
  return availableBridges[chain][0]
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
  [BlockChainType.cosmos]: 'https://rpc-cosmoshub.blockapsis.com/',
  //[BlockChainType.cro]: '',
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

  cw20_tokens = '/cw20/tokens.json',

  ibc_tokens = '/ibc/tokens.json',
}
