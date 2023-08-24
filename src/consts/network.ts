import { BlockChainType } from 'types/network'
import BinanceSvg from 'images/bsc.svg'
import EthereumSvg from 'images/ethereum.svg'
import TerraSvg from 'images/terra.svg'
import HarmonySvg from 'images/harmony.svg'
import OsmoSvg from 'images/osmo.svg'
import AxelarSvg from 'images/axelar.svg'
import InjectiveSvg from 'images/injective.svg'
import AvalancheSvg from 'images/avalanche.svg'
import FantomSvg from 'images/fantom.svg'
import CosmosSvg from 'images/cosmos.svg'
//import CronosSvg from 'images/cronos.svg'
import SecretSvg from 'images/secret.svg'
import PolygonSvg from 'images/polygon.svg'
import MoonbeamSvg from 'images/moonbeam.svg'
import BigNumber from 'bignumber.js'
import { UTIL } from 'consts'

const blockChainImage: Record<BlockChainType, string> = {
  [BlockChainType.bsc]: BinanceSvg,
  [BlockChainType.ethereum]: EthereumSvg,
  [BlockChainType.terra]: TerraSvg,
  [BlockChainType.hmy]: HarmonySvg,
  [BlockChainType.osmo]: OsmoSvg,
  [BlockChainType.scrt]: SecretSvg,
  [BlockChainType.inj]: InjectiveSvg,
  [BlockChainType.axelar]: AxelarSvg,
  [BlockChainType.avalanche]: AvalancheSvg,
  [BlockChainType.fantom]: FantomSvg,
  [BlockChainType.cosmos]: CosmosSvg,
  [BlockChainType.polygon]: PolygonSvg,
  [BlockChainType.moonbeam]: MoonbeamSvg,
  //[BlockChainType.cro]: CronosSvg,
}

const blockChainName: Record<BlockChainType, string> = {
  [BlockChainType.bsc]: 'BSC',
  [BlockChainType.ethereum]: 'Ethereum',
  [BlockChainType.terra]: 'TerraClassic',
  [BlockChainType.hmy]: 'Harmony',
  [BlockChainType.osmo]: 'Osmosis',
  [BlockChainType.scrt]: 'Secret',
  [BlockChainType.inj]: 'Injective',
  [BlockChainType.axelar]: 'Axelar',
  [BlockChainType.avalanche]: 'Avalanche',
  [BlockChainType.fantom]: 'Fantom',
  [BlockChainType.cosmos]: 'Cosmos',
  [BlockChainType.polygon]: 'Polygon',
  [BlockChainType.moonbeam]: 'Moonbeam',
  //[BlockChainType.cro]: 'Cronos',
}

const metamaskRpc: Record<BlockChainType, string[]> = {
  // used only for EVM on suugest chain
  [BlockChainType.bsc]: [
    'https://bsc-dataseed.binance.org/',
    'https://bsc-dataseed1.defibit.io/',
    'https://bsc-dataseed1.ninicoin.io/',
    'https://bscrpc.com',
  ],
  [BlockChainType.avalanche]: [
    'https://api.avax.network/ext/bc/C/rpc',
    'https://avalanche.public-rpc.com/',
  ],
  [BlockChainType.fantom]: ['https://rpc.ftm.tools/'],
  [BlockChainType.hmy]: [
    'https://api.harmony.one',
    'https://s3.api.harmony.one',
    'https://harmony.public-rpc.com',
  ],
  [BlockChainType.polygon]: ['https://polygon-rpc.com/'],
  [BlockChainType.moonbeam]: ['https://rpc.api.moonbeam.network'],
  [BlockChainType.ethereum]: [],
  // non EVM chains
  [BlockChainType.osmo]: [],
  [BlockChainType.scrt]: [],
  [BlockChainType.inj]: [],
  [BlockChainType.axelar]: [],
  [BlockChainType.terra]: [],
  [BlockChainType.cosmos]: [],
  //[BlockChainType.cro]: '[],
}

interface WormholeConsts {
  testnet?: {
    chainid: number
    tokenBridge: string
  }
  mainnet?: {
    chainid: number
    tokenBridge: string
  }
}

const wormholeContracts: Record<BlockChainType, WormholeConsts> = {
  // https://docs.wormholenetwork.com/wormhole/contracts
  [BlockChainType.bsc]: {
    testnet: {
      chainid: 4,
      tokenBridge: '0x68605AD7b15c732a30b1BbC62BE8F2A509D74b4D',
    },
    mainnet: {
      chainid: 4,
      tokenBridge: '0xB6F6D86a8f9879A9c87f643768d9efc38c1Da6E7',
    },
  },
  [BlockChainType.ethereum]: {
    testnet: {
      chainid: 10001,
      tokenBridge: '0x210c5F5e2AF958B4defFe715Dc621b7a3BA888c5',
    },
    mainnet: {
      chainid: 2,
      tokenBridge: '0x3ee18B2214AFF97000D974cf647E7C347E8fa585',
    },
  },
  [BlockChainType.terra]: {
    testnet: {
      chainid: 3,
      tokenBridge: 'terra1pd65m0q9tl3v8znnz5f5ltsfegyzah7g42cx5v',
    },
    mainnet: {
      chainid: 3,
      tokenBridge: 'terra10nmmwe8r3g99a9newtqa7a75xfgs2e8z87r2sf',
    },
  },
  [BlockChainType.avalanche]: {
    testnet: {
      chainid: 6,
      tokenBridge: '0x7bbcE28e64B3F8b84d876Ab298393c38ad7aac4C',
    },
    mainnet: {
      chainid: 6,
      tokenBridge: '0x0e082F06FF657D94310cB8cE8B0D9a04541d8052',
    },
  },
  [BlockChainType.fantom]: {
    testnet: {
      chainid: 10,
      tokenBridge: '0x1BB3B4119b7BA9dfad76B0545fb3F531383c3bB7',
    },
    mainnet: {
      chainid: 10,
      tokenBridge: '0x7C9Fc5741288cDFdD83CeB07f3ea7e22618D79D2',
    },
  },
  [BlockChainType.polygon]: {
    testnet: {
      chainid: 5,
      tokenBridge: '0x0CBE91CF822c73C2315FB05100C2F714765d5c20',
    },
    mainnet: {
      chainid: 5,
      tokenBridge: '0x5a58505a96D1dbf8dF91cB21B54419FC36e93fdE',
    },
  },
  [BlockChainType.moonbeam]: {},
  [BlockChainType.cosmos]: {},
  [BlockChainType.hmy]: {},
  [BlockChainType.osmo]: {},
  [BlockChainType.scrt]: {},
  [BlockChainType.inj]: {},
  [BlockChainType.axelar]: {},
}

const isEtherBaseBlockChain = (bc: BlockChainType): boolean => {
  return [
    BlockChainType.ethereum,
    BlockChainType.bsc,
    BlockChainType.hmy,
    BlockChainType.avalanche,
    BlockChainType.fantom,
    BlockChainType.polygon,
    BlockChainType.moonbeam,
  ].includes(bc)
}

// what terra shuttle supply, https://github.com/terra-project/shuttle
// https://chainid.network/
const ETH_CHAINID = {
  ETH_MAIN: 1,
  ETH_ROPSTEN: 3,
  BSC_MAIN: 56,
  BSC_TEST: 97,
  HMY_MAIN: 1666600000,
  HMY_TEST: 1666700000,
  AVAX_MAIN: 43114,
  FTM_MAIN: 250,
  POLY_MAIN: 137,
  MOON_MAIN: 1284,
}

const INFURAID =
  process.env.REACT_APP_INFURAID || 'a2efa9feabf84deb8f4dc696adf8f360'

const TERRA_EXTENSION =
  'https://chrome.google.com/webstore/detail/terra-station-wallet/aiifbnbfobpmeekipheeijimdpnlpgpp'
const TERRA_EXTENSION_FIREFOX =
  'https://addons.mozilla.org/en-US/firefox/addon/terra-station-wallet/'

const BSC_EXTENSION =
  'https://chrome.google.com/webstore/detail/binance-chain-wallet/fhbohimaelbohpjbbldcngcnapndodjp'
const KEPLR_EXTENSION =
  'https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap'
const CHROME = 'https://google.com/chrome'

const TERRA_ASSETS_URL = process.env.REACT_APP_TERRA_ASSETS_URL || 'https://assets.terra.dev'

const getEtherPricePerUst = async (): Promise<BigNumber> => {
  try {
    const fetchData = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
      {
        headers: {
          Accept: 'application/json',
        },
        cache: 'reload',
      }
    ).then((val) => val.json())

    return UTIL.toBignumber(fetchData?.ethereum.usd || '0')
  } catch {
    return UTIL.toBignumber('0')
  }
}

const ETH_VAULT_TOKEN_LIST: Record<
  'mainnet' | 'testnet',
  Record<
    string,
    { ether: string; vault: string; getPricePerUst: () => Promise<BigNumber> }
  >
> = {
  mainnet: {
    terra1dzhzukyezv0etz22ud940z7adyv7xgcjkahuun: {
      ether: '0x707F9118e33A9B8998beA41dd0d46f38bb963FC8',
      vault: '0xF9dcf31EE6EB94AB732A43c2FbA1dC6179c98965',
      getPricePerUst: getEtherPricePerUst,
    },
  },
  testnet: {
    terra19mkj9nec6e3y5754tlnuz4vem7lzh4n0lc2s3l: {
      ether: '0xA60100d5e12E9F83c1B04997314cf11685A618fF',
      vault: '0xDD7e8f8047D78bB103FAb4bAc1259Da207Da3861',
      getPricePerUst: getEtherPricePerUst,
    },
  },
}

export default {
  blockChainImage,
  blockChainName,
  wormholeContracts,
  isEtherBaseBlockChain,
  metamaskRpc,
  INFURAID,
  TERRA_ASSETS_URL,
  TERRA_EXTENSION,
  TERRA_EXTENSION_FIREFOX,
  BSC_EXTENSION,
  KEPLR_EXTENSION,
  CHROME,
  ETH_CHAINID,
  ETH_VAULT_TOKEN_LIST,
}
