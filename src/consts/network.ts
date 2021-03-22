import { BlockChainType, LocalTerraNetwork } from 'types/network'
import BinanceChainPng from 'images/BinanceChain.png'
import EthereumPng from 'images/Ethereum.png'
import TerraPng from 'images/Terra.png'

const blockChainImage: Record<BlockChainType, string> = {
  [BlockChainType.bsc]: BinanceChainPng,
  [BlockChainType.ethereum]: EthereumPng,
  [BlockChainType.terra]: TerraPng,
}

const blockChainName: Record<BlockChainType, string> = {
  [BlockChainType.bsc]: 'BSC',
  [BlockChainType.ethereum]: 'Ethereum',
  [BlockChainType.terra]: 'Terra',
}

// what terra shuttle supply, https://github.com/terra-project/shuttle
// https://chainid.network/
const ETH_CHAINID = {
  ETH_MAIN: 1,
  ETH_ROPSTEN: 3,
  BSC_MAIN: 56,
  BSC_TEST: 97,
}

const INFURAID = '87ae9df0054a4467b5de8501e80bc07c'

const TERRA_EXTENSION = 'https://terra.money/extension'
const BSC_EXTENSION =
  'https://chrome.google.com/webstore/detail/binance-chain-wallet/fhbohimaelbohpjbbldcngcnapndodjp?utm_source=chrome-ntp-icon'
const CHROME = 'https://google.com/chrome'

const terra_networks: Record<'mainnet' | 'testnet', LocalTerraNetwork> = {
  mainnet: {
    mantle: 'https://mantle.terra.dev/',
    shuttle: {
      ethereum: 'terra13yxhrk08qvdf5zdc9ss5mwsg5sf7zva9xrgwgc',
      bsc: 'terra1g6llg3zed35nd3mh9zx6n64tfw3z67w2c48tn2',
    },
  },
  testnet: {
    mantle: 'https://tequila-mantle.terra.dev/',
    shuttle: {
      ethereum: 'terra10a29fyas9768pw8mewdrar3kzr07jz8f3n73t3',
      bsc: 'terra1paav7jul3dzwzv78j0k59glmevttnkfgmgzv2r',
    },
  },
}

const SHUTTLE_PAIRS = 'https://assets.terra.money/cw20/pairs.json'

const TERRA_WHITELIST = 'https://assets.terra.money/cw20/tokens.json'
const ETH_WHITELIST = 'https://assets.terra.money/shuttle/eth.json'
const BSC_WHITELIST = 'https://assets.terra.money/shuttle/bsc.json'

export default {
  blockChainImage,
  blockChainName,
  terra_networks,
  INFURAID,
  TERRA_EXTENSION,
  BSC_EXTENSION,
  CHROME,
  ETH_CHAINID,
  SHUTTLE_PAIRS,
  TERRA_WHITELIST,
  ETH_WHITELIST,
  BSC_WHITELIST,
}
