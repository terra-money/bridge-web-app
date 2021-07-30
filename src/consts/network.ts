import { BlockChainType, LocalTerraNetwork } from 'types/network'
import BinanceChainPng from 'images/BinanceChain.png'
import EthereumPng from 'images/Ethereum.png'
import TerraPng from 'images/Terra.png'
import HarmonyPng from 'images/harmony-one.png'
import BigNumber from 'bignumber.js'
import { UTIL } from 'consts'

const blockChainImage: Record<BlockChainType, string> = {
  [BlockChainType.bsc]: BinanceChainPng,
  [BlockChainType.ethereum]: EthereumPng,
  [BlockChainType.terra]: TerraPng,
  [BlockChainType.hmy]: HarmonyPng,
}

const blockChainName: Record<BlockChainType, string> = {
  [BlockChainType.bsc]: 'BSC',
  [BlockChainType.ethereum]: 'Ethereum',
  [BlockChainType.terra]: 'Terra',
  [BlockChainType.hmy]: 'Harmony',
}

const isEtherBaseBlockChain = (bc: BlockChainType): boolean => {
  return [
    BlockChainType.ethereum,
    BlockChainType.bsc,
    BlockChainType.hmy,
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
}

const INFURAID =
  process.env.REACT_APP_INFURAID || 'a2efa9feabf84deb8f4dc696adf8f360'

const TERRA_EXTENSION = 'https://terra.money/extension'
const BSC_EXTENSION =
  'https://chrome.google.com/webstore/detail/binance-chain-wallet/fhbohimaelbohpjbbldcngcnapndodjp?utm_source=chrome-ntp-icon'
const CHROME = 'https://google.com/chrome'

const TERRA_CHAIN_ID = {
  mainnet: 'columbus-4',
  testnet: 'tequila-0004',
}

const terra_networks: Record<'mainnet' | 'testnet', LocalTerraNetwork> = {
  mainnet: {
    mantle: 'https://mantle.terra.dev/',
    shuttle: {
      ethereum: 'terra13yxhrk08qvdf5zdc9ss5mwsg5sf7zva9xrgwgc',
      bsc: 'terra1g6llg3zed35nd3mh9zx6n64tfw3z67w2c48tn2',
      harmony: 'terra1rtn03a9l3qsc0a9verxwj00afs93mlm0yr7chk',
    },
    fcd: 'https://fcd.terra.dev',
    lcd: 'https://lcd.terra.dev',
  },
  testnet: {
    mantle: 'https://tequila-mantle.terra.dev/',
    shuttle: {
      ethereum: 'terra10a29fyas9768pw8mewdrar3kzr07jz8f3n73t3',
      bsc: 'terra1paav7jul3dzwzv78j0k59glmevttnkfgmgzv2r',
      harmony: 'terra1nrmn0klu4st0qdg4w0wcktnsu5lwfneqlgw5w9',
    },
    fcd: 'https://tequila-fcd.terra.dev',
    lcd: 'https://tequila-lcd.terra.dev',
  },
}

const SHUTTLE_PAIRS = 'https://assets.terra.money/cw20/pairs.json'

const TERRA_WHITELIST = 'https://assets.terra.money/cw20/tokens.json'
const ETH_WHITELIST = 'https://assets.terra.money/shuttle/eth.json'
const BSC_WHITELIST = 'https://assets.terra.money/shuttle/bsc.json'
const HMY_WHITELIST = 'https://assets.terra.money/shuttle/hmy.json'

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
  terra_networks,
  isEtherBaseBlockChain,
  INFURAID,
  TERRA_CHAIN_ID,
  TERRA_EXTENSION,
  BSC_EXTENSION,
  CHROME,
  ETH_CHAINID,
  SHUTTLE_PAIRS,
  TERRA_WHITELIST,
  ETH_WHITELIST,
  BSC_WHITELIST,
  HMY_WHITELIST,
  ETH_VAULT_TOKEN_LIST,
}
