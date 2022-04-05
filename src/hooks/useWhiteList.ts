import SendStore from 'store/SendStore'
import { useRecoilValue } from 'recoil'
import { BlockChainType, BridgeType } from 'types'
import NetworkStore from 'store/NetworkStore'

// full whitelist
const whitelist: Record<
  BlockChainType,
  Record<string, Record<string, string>>
> = {
  [BlockChainType.avalanche]: {
    [BridgeType.wormhole]: {
      uluna: '0x70928E5B188def72817b7775F0BF6325968e563B',
      uusd: '0xb599c3590F42f8F995ECfa0f85D2980B76862fc1',
    },
    [BridgeType.axelar]: {
      uluna: '0x120AD3e5A7c796349e591F1570D9f7980F4eA9cb',
      uusd: '0x260Bbf5698121EB85e7a74f2E45E16Ce762EbE11',
    },
  },
  [BlockChainType.bsc]: {
    [BridgeType.wormhole]: {
      uluna: '0x156ab3346823B651294766e23e6Cf87254d68962',
      uusd: '0x3d4350cD54aeF9f9b2C29435e0fa809957B3F30a',
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
    [BridgeType.shuttle]: {
      uluna: '0xECCF35F941Ab67FfcAA9A1265C2fF88865caA005',
      uusd: '0x23396cF899Ca06c4472205fC903bDB4de249D6fC',
      ukrw: '0xfFBDB9BDCae97a962535479BB96cC2778D65F4dd',
      usdr: '0x7d5f9F8CF59986743f34BC137Fc197E2e22b7B05',
      umnt: '0x41D74991509318517226755E508695c4D1CE43a6',
      terra15gwkyepfc6xgca5t5zefzwy42uts8l2m4g40k6:
        '0x5B6DcF557E2aBE2323c48445E8CC948910d8c2c9',
      terra1vxtwu4ehgzz77mnfwrntyrmgl64qjs75mpwqaz:
        '0x900AEb8c40b26A8f8DfAF283F884b03EE7Abb3Ec',
      terra1h8arz2k547uvmpxctuwush3jzc8fun4s96qgwt:
        '0x62D71B23bF15218C7d2D7E48DBbD9e9c650B173f',
      terra14y5affaarufk3uscy2vr6pe6w6zqf2wpjzn5sh:
        '0xF215A127A196e3988C09d052e16BcFD365Cd7AA3',
      terra1jsxngqasf2zynj5kyh0tgq9mj3zksa5gk35j4k:
        '0xa04F060077D90Fe2647B61e4dA4aD1F97d6649dc',
      terra1csk6tc7pdmpr782w527hwhez6gfv632tyf72cp:
        '0x1Cb4183Ac708e07511Ac57a2E45A835F048D7C56',
      terra1cc3enj9qgchlrj34cnzhwuclc4vl2z3jl7tkqg:
        '0x7426Ab52A0e057691E2544fae9C8222e958b2cfB',
      terra1227ppwxxj3jxz8cfgq00jgnxqcny7ryenvkwj6:
        '0x0ab06caa3Ca5d6299925EfaA752A2D2154ECE929',
      terra165nd2qmrtszehcfrntlplzern7zl4ahtlhd5t2:
        '0x3947B992DC0147D2D89dF0392213781b04B25075',
      terra1w7zgkcyt7y4zpct9dw8mw362ywvdlydnum2awa:
        '0xcA2f75930912B85d8B2914Ad06166483c0992945',
      terra15hp9pr8y4qsvqvxf3m4xeptlk7l8h60634gqec:
        '0x1658AeD6C7dbaB2Ddbd8f5D898b0e9eAb0305813',
      terra1kscs6uhrqwy6rx5kuw5lwpuqvm3t6j2d6uf2lp:
        '0x211e763d0b9311c08EC92D72DdC20AB024b6572A',
      terra1lvmx8fsagy70tv0fhmfzdw9h6s3sy4prz38ugf:
        '0x9cDDF33466cE007676C827C76E799F5109f1843C',
      terra1zp3a6q6q4953cz376906g5qfmxnlg77hx3te45:
        '0x92E744307694Ece235cd02E82680ec37c657D23E',
      terra1mqsjugsugfprn3cvgxsrr8akkvdxv2pzc74us7:
        '0x5501F4713020cf299C3C5929da549Aab3592E451',
      terra18wayjpyq28gd970qzgjfmsjj7dmgdk039duhph:
        '0x49022089e78a8D46Ec87A3AF86a1Db6c189aFA6f',
    },
  },
  [BlockChainType.cosmos]: {
    [BridgeType.ibc]: {
      uluna:
        'ibc/F871EFABE94BCF72D386F0FBCACE79A63000B7A9C19B00B65CD16EA229693F66',
      uusd: 'ibc/F02E88911AE47874FEA3F7333748DB54F42415018464B52074800CDBB7F9F2D7',
      'ibc/18ABA66B791918D51D33415DA173632735D830E2E77E63C91C11D3008CFD5262':
        'uatom',
    },
  },
  [BlockChainType.ethereum]: {
    [BridgeType.shuttle]: {
      uluna: '0xd2877702675e6cEb975b4A1dFf9fb7BAF4C91ea9',
      uusd: '0xa47c8bf37f92aBed4A126BDA807A7b7498661acD',
      ukrw: '0xcAAfF72A8CbBfc5Cf343BA4e26f65a257065bFF1',
      usdr: '0x676Ad1b33ae6423c6618C1AEcf53BAa29cf39EE5',
      umnt: '0x156B36ec68FdBF84a925230BA96cb1Ca4c4bdE45',
      terra14z56l0fp2lsf86zy3hty2z47ezkhnthtr9yq76:
        '0x0F3ADC247E91c3c50bC08721355A41037E89Bc20',
      terra15gwkyepfc6xgca5t5zefzwy42uts8l2m4g40k6:
        '0x09a3EcAFa817268f77BE1283176B946C4ff2E608',
      terra1vxtwu4ehgzz77mnfwrntyrmgl64qjs75mpwqaz:
        '0xd36932143F6eBDEDD872D5Fb0651f4B72Fd15a84',
      terra1h8arz2k547uvmpxctuwush3jzc8fun4s96qgwt:
        '0x59A921Db27Dd6d4d974745B7FfC5c33932653442',
      terra14y5affaarufk3uscy2vr6pe6w6zqf2wpjzn5sh:
        '0x21cA39943E91d704678F5D00b6616650F066fD63',
      terra1jsxngqasf2zynj5kyh0tgq9mj3zksa5gk35j4k:
        '0xC8d674114bac90148d11D3C1d33C61835a0F9DCD',
      terra1csk6tc7pdmpr782w527hwhez6gfv632tyf72cp:
        '0x13B02c8dE71680e71F0820c996E4bE43c2F57d15',
      terra1cc3enj9qgchlrj34cnzhwuclc4vl2z3jl7tkqg:
        '0xEdb0414627E6f1e3F082DE65cD4F9C693D78CCA9',
      terra1227ppwxxj3jxz8cfgq00jgnxqcny7ryenvkwj6:
        '0x41BbEDd7286dAab5910a1f15d12CBda839852BD7',
      terra165nd2qmrtszehcfrntlplzern7zl4ahtlhd5t2:
        '0x0cae9e4d663793c2a2A0b211c1Cf4bBca2B9cAa7',
      terra1w7zgkcyt7y4zpct9dw8mw362ywvdlydnum2awa:
        '0x56aA298a19C93c6801FDde870fA63EF75Cc0aF72',
      terra15hp9pr8y4qsvqvxf3m4xeptlk7l8h60634gqec:
        '0x1d350417d9787E000cc1b95d70E9536DcD91F373',
      terra1kscs6uhrqwy6rx5kuw5lwpuqvm3t6j2d6uf2lp:
        '0x9d1555d8cB3C846Bb4f7D5B1B1080872c3166676',
      terra1lvmx8fsagy70tv0fhmfzdw9h6s3sy4prz38ugf:
        '0x31c63146a635EB7465e5853020b39713AC356991',
      terra1zp3a6q6q4953cz376906g5qfmxnlg77hx3te45:
        '0xf72FCd9DCF0190923Fadd44811E240Ef4533fc86',
      terra1mqsjugsugfprn3cvgxsrr8akkvdxv2pzc74us7:
        '0x0e99cC0535BB6251F6679Fa6E65d6d3b430e840B',
      terra18wayjpyq28gd970qzgjfmsjj7dmgdk039duhph:
        '0x1e25857931F75022a8814e0B0c3a371942A88437',
      terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu:
        '0xa8De3e3c934e2A1BB08B010104CcaBBD4D6293ab',
    },
    [BridgeType.wormhole]: {
      uluna: '0xbd31ea8212119f94a611fa969881cba3ea06fa3d',
      uusd: '0xa693B19d2931d498c5B318dF961919BB4aee87a5',
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
      uusd: '0x085416975fe14C2A731a97eC38B9bF8135231F62',
    },
  },
  [BlockChainType.fantom]: {
    [BridgeType.wormhole]: {
      uusd: '0x846e4D51d7E2043C1a87E0Ab7490B93FB940357b',
    },
    [BridgeType.axelar]: {
      uluna: '0x5e3C572A97D898Fe359a2Cea31c7D46ba5386895',
      uusd: '0x2B9d3F168905067D88d93F094C938BACEe02b0cB',
    },
  },
  [BlockChainType.hmy]: {
    [BridgeType.shuttle]: {
      uluna: '0x95CE547D730519A90dEF30d647F37D9E5359B6Ae',
      uusd: '0x224e64ec1BDce3870a6a6c777eDd450454068FEC',
      terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu:
        '0x4D9d9653367FD731Df8412C74aDA3E1c9694124a',
    },
  },
  [BlockChainType.inj]: {
    [BridgeType.ibc]: {
      uluna:
        'ibc/B8AF5D92165F35AB31F3FC7C7B444B9D240760FA5D406C49D24862BD0284E395',
      uusd: 'ibc/B448C0CA358B958301D328CCDC5D5AD642FC30A6D3AE106FF721DB315F3DDE5C',
    },
  },
  [BlockChainType.osmo]: {
    [BridgeType.ibc]: {
      uluna:
        'ibc/0EF15DF2F02480ADE0BB6E85D9EBB5DAEA2836D3860E9F97F9AADE4F57A31AA0',
      uusd: 'ibc/BE1BB42D4BE3C30D50B68D7C41DB4DFCE9678E8EF8C539F6E6A9345048894FCC',
      ukrw: 'ibc/204A582244FC241613DBB50B04D1D454116C58C4AF7866C186AA0D6EEAD42780',
      'ibc/0471F1C4E7AFD3F07702BEF6DC365268D64570F7C1FDC98EA6098DD6DE59817B':
        'uosmo',
    },
  },
  [BlockChainType.scrt]: {
    [BridgeType.ibc]: {
      uluna:
        'ibc/D70B0FBF97AEB04491E9ABF4467A7F66CD6250F4382CE5192D856114B83738D2',
      uusd: 'ibc/4294C3DB67564CF4A0B2BFACC8415A59B38243F6FF9E288FBA34F9B4823BA16E',
      'ibc/EB2CED20AB0466F18BE49285E56B31306D4C60438A022EA995BA65D5E3CF7E09':
        'uscrt',
    },
  },
  [BlockChainType.polygon]: {
    [BridgeType.wormhole]: {
      uluna: '0x9cd6746665D9557e1B9a775819625711d0693439',
      uusd: '0xE6469Ba6D2fD6130788E0eA9C0a0515900563b59',
    },
    [BridgeType.axelar]: {
      uusd: '0xeDDc6eDe8F3AF9B4971e1Fa9639314905458bE87',
      uluna: '0xa17927fB75E9faEA10C08259902d0468b3DEad88',
    },
  },
  [BlockChainType.moonbeam]: {
    [BridgeType.axelar]: {
      uusd: '0x085416975fe14C2A731a97eC38B9bF8135231F62',
      uluna: '0x31DAB3430f3081dfF3Ccd80F17AD98583437B213',
    },
  },
  // other chains
  [BlockChainType.axelar]: {},
  [BlockChainType.terra]: {},
}

const testnetWhitelist: Record<
  BlockChainType,
  Record<string, Record<string, string>>
> = {
  [BlockChainType.bsc]: {
    [BridgeType.wormhole]: {},
    [BridgeType.shuttle]: {
      uluna: '0xA1B4Aa780713df91e9Fa0FAa415ce49756D81E3b',
      uusd: '0x66BDf3Bd407A63eAB5eAF5eCE69f2D7bb403EfC9',
      ukrw: '0x59a870b16adE2A152815Ba0d4Fa074fc3F71A828',
      usdr: '0x5e2c2088d3fB10aAb25a0D323CdBEc5147232B1a',
      umnt: '0x1449D1Ba8FB922E74F7761F077e77EAe66A0f8DA',
      terra10llyp6v3j3her8u3ce66ragytu45kcmd9asj3u:
        '0x320106A19C934ab8dbdde8056Ebae5A6f340720e',
      terra16vfxm98rxlc8erj4g0sj5932dvylgmdufnugk0:
        '0x0dFa0F08136DA5d28618E7E31A7e24b01a95bB69',
      terra1qg9ugndl25567u03jrr79xur2yk9d632fke3h2:
        '0x56a31ea21862447E3Af9bfe76A45679E44103274',
      terra1nslem9lgwx53rvgqwd8hgq7pepsry6yr3wsen4:
        '0xA2a42F0deB45ca7310a3C02A70fb569d5d5248FA',
      terra1djnlav60utj06kk9dl7defsv8xql5qpryzvm3h:
        '0xc6F5e6476958cA81eC8FC68A1ea7c68206b0e501',
      terra18yx7ff8knc98p07pdkhm3u36wufaeacv47fuha:
        '0x1Ad3354B2E7C0F7D5A370a03CAf439DD345437a9',
      terra1ax7mhqahj6vcqnnl675nqq2g9wghzuecy923vy:
        '0x5C4273b1B20112321f0951D0bC2d5eD40c800226',
      terra12s2h8vlztjwu440khpc0063p34vm7nhu25w4p9:
        '0xE4f2C30E938c24ee874dfDFAb20fFFBA81323457',
      terra12saaecsqwxj04fn0jsv4jmdyp6gylptf5tksge:
        '0xfBC94545AD2ff3F7B009258FB43F2EAb46744767',
      terra15dr4ah3kha68kam7a907pje9w6z2lpjpnrkd06:
        '0xFc78bf14Dc997e681dAc4b4D811B45026d04123F',
      terra19dl29dpykvzej8rg86mjqg8h63s9cqvkknpclr:
        '0xeff3b95faC30230D30F8c8222670A3812D79857B',
      terra1fdkfhgk433tar72t4edh6p6y9rmjulzc83ljuw:
        '0x662DDF725F5BDE9b31BBD16793Fd0c234F67979B',
      terra1fucmfp8x4mpzsydjaxyv26hrkdg4vpdzdvf647:
        '0x5D428492846bd05D8137e56Fe806D28606453cbf',
      terra1z0k7nx0vl85hwpv3e3hu2cyfkwq07fl7nqchvd:
        '0x57986628daaDC418E09A2917D6c8b793B7dC1ACD',
      terra14gq9wj0tt6vu0m4ec2tkkv4ln3qrtl58lgdl2c:
        '0x354CA25cf8eB08537f6047e9daF02Eb02222C1D5',
      terra1qre9crlfnulcg0m68qqywqqstplgvrzywsg3am:
        '0x24fE38158A7550bEd9A451CBeA67dA4BdC920E95',
    },
  },
  [BlockChainType.ethereum]: {
    [BridgeType.shuttle]: {
      uluna: '0xbf51453468771D14cEbdF8856cC5D5145364Cd6F',
      uusd: '0x6cA13a4ab78dd7D657226b155873A04DB929A3A4',
    },
    [BridgeType.wormhole]: {},
  },
  [BlockChainType.hmy]: {
    [BridgeType.shuttle]: {
      uluna: '0xdfe87bF751D4abEb3E4926DdAa1e6736B07d8FF4',
      uusd: '0x0C096AdFdA2a3Bf74e6Ca33c05eD0b472b622247',
    },
  },
  // only wormhole
  [BlockChainType.avalanche]: {
    [BridgeType.wormhole]: {},
  },
  [BlockChainType.fantom]: {
    [BridgeType.wormhole]: {},
  },
  [BlockChainType.polygon]: {
    [BridgeType.wormhole]: {},
  },
  // axelar-ibc chains (not supported on testnet)
  [BlockChainType.moonbeam]: {},
  [BlockChainType.cosmos]: {},
  [BlockChainType.inj]: {},
  [BlockChainType.osmo]: {},
  [BlockChainType.scrt]: {},
  // other chains
  [BlockChainType.axelar]: {},
  [BlockChainType.terra]: {},
}

// return current whitelist
export default function useWhiteList(): Record<string, string> {
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)
  const toBlockChain = useRecoilValue(SendStore.toBlockChain)
  const bridgeUsed = useRecoilValue(SendStore.bridgeUsed)
  const isTestnet = useRecoilValue(NetworkStore.isTestnet)

  const chain =
    fromBlockChain === BlockChainType.terra ? toBlockChain : fromBlockChain

  if (!bridgeUsed || chain === BlockChainType.terra) return {}

  return (
    (isTestnet
      ? testnetWhitelist[chain]?.[bridgeUsed]
      : whitelist[chain]?.[bridgeUsed]) || {}
  )
}
