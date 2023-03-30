import SendStore from 'store/SendStore'
import { useRecoilValue } from 'recoil'
import { BlockChainType, BridgeType } from 'types'

// full whitelist
const whitelist: Record<
  BlockChainType,
  Record<string, Record<string, string>>
> = {
  [BlockChainType.cosmos]: {
    [BridgeType.ibc]: {
      uluna:
        'ibc/34CEF8B6A6424C45FE3CCC4A02C9DF9BB38BACC323E08DFFEFE9E4B18BB89AC4',
      'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2':
        'uatom',
    },
  },
  [BlockChainType.ethereum]: {
    [BridgeType.axelar]: {
      'ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4':
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      'ibc/CBF67A2BCF6CAE343FDF251E510C8E18C361FC02B23430C121116E0811835DEF':
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      'ibc/05D299885B07905B6886F554B39346EA6761246076A1120B1950049B92B922DD':
        '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      'ibc/BC8A77AFBD872FDC32A348D3FB10CC09277C266CFE52081DE341C7EC6752E674':
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    },
  },
  [BlockChainType.avalanche]: {
    [BridgeType.axelar]: {
      'ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4':
        '0xfaB550568C688d5D8A52C7d794cb93Edc26eC0eC',
    },
  },
  [BlockChainType.osmo]: {
    [BridgeType.ibc]: {
      uluna:
        'ibc/785AFEC6B3741100D15E7AF01374E3C4C36F24888E96479B1C33F5C71F364EF9',
      'ibc/0471F1C4E7AFD3F07702BEF6DC365268D64570F7C1FDC98EA6098DD6DE59817B':
        'uosmo',
      terra1ecgazyd0waaj3g7l9cmy5gulhxkps2gmxu9ghducvuypjq68mq2s5lvsct:
        'ibc/3CB43B244957F7CB0A8C0C7F81ADEA524A2AC57E48716B6F8F781286D96830D2',
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
      terra1ecgazyd0waaj3g7l9cmy5gulhxkps2gmxu9ghducvuypjq68mq2s5lvsct:
        'ibc/EC324F1CEEA2587DC6D6A3D2ABDE04B37F2EDC3945553FF7B3F8D03FA5E5576D',
    },
  },
  [BlockChainType.crescent]: {
    [BridgeType.ibc]: {
      uluna:
        'ibc/177904239844D7D0E59D04F864D1278C07A80688EA67BCFA940E954FFA4CF699',
      'ibc/B090DC21658BD57698522880590CA53947B8B09355764131AA94EC75517D46A5':
        'ucre',
    },
  },
  [BlockChainType.kujira]: {
    [BridgeType.ibc]: {
      uluna:
        'ibc/DA59C009A0B3B95E0549E6BF7B075C8239285989FF457A8EDDBB56F10B2A6986',
      'ibc/B22B4DD21586965DAEF42A7600BA371EA77C02E90FC8A7F2330BF9F9DE129B07':
        'ukuji',
      terra1ecgazyd0waaj3g7l9cmy5gulhxkps2gmxu9ghducvuypjq68mq2s5lvsct:
        'ibc/F33B313325B1C99B646B1B786F1EA621E3794D787B90C204C30FE1D4D45970AE',
    },
    [BridgeType.axelar]: {
      'ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4':
        'ibc/295548A78785A1007F232DE286149A6FF512F180AF5657780FC89C009E2C348F',
      'ibc/CBF67A2BCF6CAE343FDF251E510C8E18C361FC02B23430C121116E0811835DEF':
        'ibc/F2331645B9683116188EF36FC04A809C28BD36B54555E8705A37146D0182F045',
    },
  },
  [BlockChainType.carbon]: {
    [BridgeType.ibc]: {
      uluna:
        'ibc/2B58B8C147E8718EECCB3713271DF46DEE8A3A00A27242628604E31C2F370EF5',
      terra1ecgazyd0waaj3g7l9cmy5gulhxkps2gmxu9ghducvuypjq68mq2s5lvsct:
        'ibc/62A3870B9804FC3A92EAAA1F0F3F07E089DBF76CC521466CA33F5AAA8AD42290',
    },
  },
  [BlockChainType.stride]: {
    [BridgeType.ibc]: {
      'ibc/08095CEDEA29977C9DD0CE9A48329FDA622C183359D5F90CF04CC4FF80CBE431':
        'stuluna',
      'ibc/0EFC7B44625187BFB60AF09FF28A25FA49B68B959A505CC5313DF0498D8CF528':
        'ustrd',
      uluna:
        'ibc/E61BCB1126F42A2ED73B4CEA2221C9635BC2102F0417543C38071779F991942E',
    },
  },
  [BlockChainType.migaloo]: {
    [BridgeType.ibc]: {
      uluna:
        'ibc/4627AD2524E3E0523047E35BB76CC90E37D9D57ACF14F0FCBCEB2480705F3CB8',
      terra1ecgazyd0waaj3g7l9cmy5gulhxkps2gmxu9ghducvuypjq68mq2s5lvsct:
        'ibc/05238E98A143496C8AF2B6067BABC84503909ECE9E45FBCBAC2CBA5C889FD82A',
      terra17aj4ty4sz4yhgm08na8drc0v03v2jwr3waxcqrwhajj729zhl7zqnpc0ml :
        'ibc/40C29143BF4153B365089E40E437B7AA819672646C45BB0A5F1E10915A0B6708',
    },
  },
  // not yet supported on terra2
  [BlockChainType.bsc]: {},
  [BlockChainType.fantom]: {},
  [BlockChainType.inj]: {},
  [BlockChainType.polygon]: {},
  [BlockChainType.moonbeam]: {},
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
