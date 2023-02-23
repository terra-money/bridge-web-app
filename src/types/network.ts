export enum BlockChainType {
  terra = 'terra',
  ethereum = 'ethereum',
  bsc = 'bsc',
  osmo = 'osmosis',
  scrt = 'secret',
  inj = 'injective',
  axelar = 'axelar',
  avalanche = 'avalanche',
  fantom = 'fantom',
  cosmos = 'cosmos',
  polygon = 'polygon',
  moonbeam = 'moonbeam',
  juno = 'juno',
  crescent = 'crescent',
  kujira = 'kujira',
  carbon = 'carbon',
  stride = 'stride',
  migaloo = 'migaloo',
}

export enum BridgeType {
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
  [BlockChainType.juno]: [BridgeType.ibc],
  [BlockChainType.kujira]: [BridgeType.ibc, BridgeType.axelar],
  [BlockChainType.crescent]: [BridgeType.ibc],
  [BlockChainType.carbon]: [BridgeType.ibc],
  [BlockChainType.stride]: [BridgeType.ibc],
  [BlockChainType.migaloo]: [BridgeType.ibc],
  [BlockChainType.ethereum]: [BridgeType.axelar],
  [BlockChainType.avalanche]: [BridgeType.axelar],

  // disabled
  [BlockChainType.bsc]: [],
  [BlockChainType.fantom]: [BridgeType.wormhole, BridgeType.axelar],
  [BlockChainType.polygon]: [BridgeType.wormhole, BridgeType.axelar],
  [BlockChainType.moonbeam]: [BridgeType.axelar],
  [BlockChainType.terra]: [],
}

export function getDefaultBridge(
  from: BlockChainType,
  to: BlockChainType
): BridgeType | undefined {
  const chain = from === BlockChainType.terra ? to : from
  return availableBridges[chain][0]
}

export type IbcNetwork =
  | BlockChainType.osmo
  | BlockChainType.scrt
  | BlockChainType.inj
  | BlockChainType.axelar
  | BlockChainType.cosmos
  | BlockChainType.juno
  | BlockChainType.crescent
  | BlockChainType.kujira
  | BlockChainType.carbon
  | BlockChainType.stride
  | BlockChainType.migaloo

export function isIbcNetwork(network: BlockChainType): boolean {
  return [
    BlockChainType.osmo,
    BlockChainType.scrt,
    BlockChainType.inj,
    BlockChainType.axelar,
    BlockChainType.cosmos,
    BlockChainType.juno,
    BlockChainType.crescent,
    BlockChainType.kujira,
    BlockChainType.carbon,
    BlockChainType.stride,
    BlockChainType.migaloo,
  ].includes(network)
}

// channels Terra -> IBC chain
export const terraIbcChannels: Record<IbcNetwork, string> = {
  [BlockChainType.osmo]: 'channel-1',
  [BlockChainType.scrt]: 'channel-3',
  [BlockChainType.inj]: 'channel-', // TODO: update inj channel
  [BlockChainType.axelar]: 'channel-6',
  [BlockChainType.cosmos]: 'channel-0',
  [BlockChainType.juno]: 'channel-2',
  [BlockChainType.crescent]: 'channel-37',
  [BlockChainType.kujira]: 'channel-10',
  [BlockChainType.carbon]: 'channel-36',
  [BlockChainType.stride]: 'channel-46',
  [BlockChainType.migaloo]: 'channel-86',
}

export type IcsNetwork =
  | BlockChainType.osmo
  | BlockChainType.juno
  | BlockChainType.kujira
  | BlockChainType.carbon
  | BlockChainType.migaloo

// channels IBC chain -> Axelar
export const axelarIbcChannels: Record<string, string> = {
  [BlockChainType.kujira]: 'channel-9',
}

// channels IBC chain -> Terra
export const ibcChannels: Record<IbcNetwork, string> = {
  [BlockChainType.osmo]: 'channel-251',
  [BlockChainType.scrt]: 'channel-16',
  [BlockChainType.inj]: 'channel-', // TODO: update inj channel
  [BlockChainType.axelar]: 'channel-11',
  [BlockChainType.cosmos]: 'channel-339',
  [BlockChainType.juno]: 'channel-86',
  [BlockChainType.crescent]: 'channel-27',
  [BlockChainType.kujira]: 'channel-5',
  [BlockChainType.carbon]: 'channel-12',
  [BlockChainType.stride]: 'channel-52',
  [BlockChainType.migaloo]: 'channel-0',
}

// channels Terra -> IBC chain
export const terraIcsChannels: Record<
  IcsNetwork,
  { contract?: string; channel: string }
> = {
  [BlockChainType.osmo]: {
    channel: 'channel-26',
    contract:
      'terra1e0mrzy8077druuu42vs0hu7ugguade0cj65dgtauyaw4gsl4kv0qtdf2au',
  },
  [BlockChainType.kujira]: {
    channel: 'channel-28',
    contract:
      'terra1e0mrzy8077druuu42vs0hu7ugguade0cj65dgtauyaw4gsl4kv0qtdf2au',
  },
  [BlockChainType.juno]: {
    channel: 'channel-32',
    contract:
      'terra1e0mrzy8077druuu42vs0hu7ugguade0cj65dgtauyaw4gsl4kv0qtdf2au',
  },
  [BlockChainType.carbon]: {
    channel: 'channel-41',
    contract:
      'terra1e0mrzy8077druuu42vs0hu7ugguade0cj65dgtauyaw4gsl4kv0qtdf2au',
  },
  [BlockChainType.migaloo]: {
    channel: 'channel-87',
    contract:
      'terra1e0mrzy8077druuu42vs0hu7ugguade0cj65dgtauyaw4gsl4kv0qtdf2au',
  },
}

// channels IBC chain -> Terra
export const icsChannels: Record<
  IcsNetwork,
  { contract?: string; channel: string }
> = {
  [BlockChainType.osmo]: {
    channel: 'channel-341',
  },
  [BlockChainType.kujira]: {
    channel: 'channel-36',
  },
  [BlockChainType.juno]: {
    channel: 'channel-153',
    contract: 'juno1v4887y83d6g28puzvt8cl0f3cdhd3y6y9mpysnsp3k8krdm7l6jqgm0rkn',
  },
  [BlockChainType.carbon]: {
    channel: 'channel-16',
  },
  [BlockChainType.migaloo]: {
    channel: 'channel-2',
  },
}

export const ibcPrefix: Record<IbcNetwork, string> = {
  [BlockChainType.osmo]: 'osmo1',
  [BlockChainType.scrt]: 'secret1',
  [BlockChainType.inj]: 'inj1',
  [BlockChainType.axelar]: 'axelar1',
  [BlockChainType.cosmos]: 'cosmos1',
  [BlockChainType.juno]: 'juno1',
  [BlockChainType.crescent]: 'cre1',
  [BlockChainType.kujira]: 'kujira1',
  [BlockChainType.carbon]: 'swth1',
  [BlockChainType.stride]: 'stride1',
  [BlockChainType.migaloo]: 'migaloo1',
}

export const ibcChainId: Record<IbcNetwork, string> = {
  [BlockChainType.osmo]: 'osmosis-1',
  [BlockChainType.scrt]: 'secret-4',
  [BlockChainType.inj]: 'injective-1',
  [BlockChainType.axelar]: 'axelar-dojo-1',
  [BlockChainType.cosmos]: 'cosmoshub-4',
  [BlockChainType.juno]: 'juno-1',
  [BlockChainType.crescent]: 'crescent-1',
  [BlockChainType.kujira]: 'kaiyo-1',
  [BlockChainType.carbon]: 'carbon-1',
  [BlockChainType.stride]: 'stride-1',
  [BlockChainType.migaloo]: 'migaloo-1',
}

export const ibcRpc: Record<IbcNetwork, string> = {
  [BlockChainType.osmo]: 'https://rpc.osmosis.zone/',
  [BlockChainType.scrt]: 'https://lcd-secret.scrtlabs.com/rpc/',
  [BlockChainType.inj]: 'https://tm.injective.network/',
  [BlockChainType.axelar]: 'https://axelar-rpc.quickapi.com/',
  [BlockChainType.cosmos]: 'https://rpc-cosmoshub.blockapsis.com/',
  [BlockChainType.juno]: 'https://rpc.juno.omniflix.co/',
  [BlockChainType.crescent]: 'https://mainnet.crescent.network:26657/',
  [BlockChainType.kujira]: 'https://rpc.kaiyo.kujira.setten.io/',
  [BlockChainType.carbon]: 'https://tm-api.carbon.network/',
  [BlockChainType.stride]: 'https://stride-fleet.main.stridenet.co/',
  [BlockChainType.migaloo]: 'https://migaloo-rpc.polkachu.com/',
}

export interface LocalTerraNetwork {
  name: TerraNetworkEnum
  chainID: string
  mantle: string
  lcd: string
  fcd: string
  walletconnectID: number
}

export enum TerraNetworkEnum {
  mainnet = 'mainnet',
  testnet = 'testnet',
}

export enum TerraAssetsPathEnum {
  station_maintenamce = '/station/maintenance.json',
  chains = '/chains.json',

  cw20_tokens = '/cw20/tokens.json',
  ibc_tokens = '/ibc/tokens.json',
}
