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
        'ibc/F871EFABE94BCF72D386F0FBCACE79A63000B7A9C19B00B65CD16EA229693F66',
    },
  },
  [BlockChainType.ethereum]: {
    [BridgeType.wormhole]: {
      uluna: '0xbd31ea8212119f94a611fa969881cba3ea06fa3d',
      /*
      // wETH
      terra14tl83xcwqjy0ken9peu4pjjuu755lrry2uy25r:
        '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      // DAI
      terra1zmclyfepfmqvfqflu8r3lv6f75trmg05z7xq95:
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      // USDC
      terra1pepwcav40nvj3kh60qqgrk8k07ydmc00xyat06:
        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      // USDT
      terra1ce06wkrdm4vl6t0hvc0g86rsy27pu8yadg3dva:
        '0xdac17f958d2ee523a2206206994597c13d831ec7',
      // wBTC
      terra1aa7upykmmqqc63l924l5qfap8mrmx5rfdm0v55:
        '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      // bETH
      terra1u5szg038ur9kzuular3cae8hq6q5rk5u27tuvz:
        '0x707f9118e33a9b8998bea41dd0d46f38bb963fc8',
      */
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
      uluna:
        'ibc/B8AF5D92165F35AB31F3FC7C7B444B9D240760FA5D406C49D24862BD0284E395',
    },
  },
  [BlockChainType.osmo]: {
    [BridgeType.ibc]: {
      uluna:
        'ibc/0EF15DF2F02480ADE0BB6E85D9EBB5DAEA2836D3860E9F97F9AADE4F57A31AA0',
    },
  },
  [BlockChainType.scrt]: {
    [BridgeType.ibc]: {
      uluna:
        'ibc/D70B0FBF97AEB04491E9ABF4467A7F66CD6250F4382CE5192D856114B83738D2',
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
