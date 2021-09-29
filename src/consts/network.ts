import { BlockChainType } from 'types/network'
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

const TERRA_ASSETS_URL = 'https://assets.terra.money'

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
  isEtherBaseBlockChain,
  INFURAID,
  TERRA_ASSETS_URL,
  TERRA_EXTENSION,
  BSC_EXTENSION,
  CHROME,
  ETH_CHAINID,
  ETH_VAULT_TOKEN_LIST,
}
