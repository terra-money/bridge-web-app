import SendStore from 'store/SendStore'
import { useRecoilValue } from 'recoil'
import { BlockChainType, BridgeType } from 'types'

// full whitelist
const whitelist: Record<
  BlockChainType,
  Record<string, Record<string, string>>
> = {
  [BlockChainType.avalanche]: {
    [BridgeType.wormhole]: {
      uluna: '0x70928E5B188def72817b7775F0BF6325968e563B',
    },
    [BridgeType.axelar]: {
      uluna: '0x120AD3e5A7c796349e591F1570D9f7980F4eA9cb',
    },
  },
  [BlockChainType.bsc]: {
    [BridgeType.wormhole]: {
      uluna: '0x156ab3346823B651294766e23e6Cf87254d68962',
      /*
      // aUST
      terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu:
        '0x8b04E56A8cd5f4D465b784ccf564899F30Aaf88C',
      // wBNB
      terra1cetg5wruw2wsdjp7j46rj44xdel00z006e9yg8:
        '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      // BUSD
      terra1skjr69exm6v8zellgjpaa2emhwutrk5a6dz7dd:
        '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      // USDT
      terra1vlqeghv5mt5udh96kt5zxlh2wkh8q4kewkr0dd:
        '0x55d398326f99059fF775485246999027B3197955',
      */
    },
  },
  [BlockChainType.cosmos]: {
    [BridgeType.ibc]: {
      uluna:
        'ibc/34CEF8B6A6424C45FE3CCC4A02C9DF9BB38BACC323E08DFFEFE9E4B18BB89AC4',
      'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2':
        'uatom',
    },
  },
  [BlockChainType.ethereum]: {
    [BridgeType.wormhole]: {
      uluna: '0xbd31ea8212119f94a611fa969881cba3ea06fa3d',
    },
    [BridgeType.axelar]: {
      uluna: '0x31DAB3430f3081dfF3Ccd80F17AD98583437B213',
    },
  },
  [BlockChainType.fantom]: {
    [BridgeType.wormhole]: {},
    [BridgeType.axelar]: {
      uluna: '0x5e3C572A97D898Fe359a2Cea31c7D46ba5386895',
    },
  },
  [BlockChainType.inj]: {
    [BridgeType.ibc]: {
      //uluna: 'ibc/B8AF5D92165F35AB31F3FC7C7B444B9D240760FA5D406C49D24862BD0284E395',
    },
  },
  [BlockChainType.osmo]: {
    [BridgeType.ibc]: {
      uluna:
        'ibc/785AFEC6B3741100D15E7AF01374E3C4C36F24888E96479B1C33F5C71F364EF9',
      'ibc/0471F1C4E7AFD3F07702BEF6DC365268D64570F7C1FDC98EA6098DD6DE59817B':
        'uosmo',
    },
  },
  [BlockChainType.scrt]: {
    [BridgeType.ibc]: {
      uluna:
        'ibc/28DECFA7FB7E3AB58DC3B3AEA9B11C6C6B6E46356DCC26505205DAD3379984F5',
      'ibc/10BD6ED30BA132AB96F146D71A23B46B2FC19E7D79F52707DC91F2F3A45040AD':
        'uscrt',
    },
  },
  [BlockChainType.juno]: {
    [BridgeType.ibc]: {
      uluna:
        'ibc/107D152BB3176FAEBF4C2A84C5FFDEEA7C7CB4FE1BBDAB710F1FD25BCD055CBF',
      'ibc/4CD525F166D32B0132C095F353F4C6F033B0FF5C49141470D1EFDA1D63303D04':
        'ujuno',
    },
  },
  [BlockChainType.polygon]: {
    [BridgeType.wormhole]: {
      uluna: '0x9cd6746665D9557e1B9a775819625711d0693439',
    },
    [BridgeType.axelar]: {
      uluna: '0xa17927fB75E9faEA10C08259902d0468b3DEad88',
    },
  },
  [BlockChainType.moonbeam]: {
    [BridgeType.axelar]: {
      uluna: '0x31DAB3430f3081dfF3Ccd80F17AD98583437B213',
    },
  },
  // other chains
  [BlockChainType.axelar]: {},
  [BlockChainType.terra]: {},
}

// return current whitelist
export default function useWhiteList(): Record<string, string> {
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)
  const toBlockChain = useRecoilValue(SendStore.toBlockChain)
  const bridgeUsed = useRecoilValue(SendStore.bridgeUsed)

  const chain =
    fromBlockChain === BlockChainType.terra ? toBlockChain : fromBlockChain

  if (!bridgeUsed || chain === BlockChainType.terra) return {}

  return whitelist[chain]?.[bridgeUsed] || {}
}
