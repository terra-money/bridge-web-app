import axios from 'axios'
import { AssetType } from 'types/asset'

interface Pool {
  asset: string
  assetDepth: string
  assetPrice: string
  assetPriceUSD: string
  liquidityUnits: string
  poolAPY: string
  runeDepth: string
  status: 'available' | 'staged'
  synthSupply: string
  synthUnits: string
  units: string
  volume24h: string
}

export interface ThorAssetType extends AssetType {
  thorId: string
  token?: string
}

export const thorAssets: Record<string, ThorAssetType> = {
  'BTC.BTC': {
    thorId: 'BTC.BTC',
    name: 'Bitcoin',
    symbol: 'BTC',
    logoURI: 'https://assets.terra.money/icon/thorswap/BTC.svg',
    terraToken: 'BTC',
  },
  'LTC.LTC': {
    thorId: 'LTC.LTC',
    name: 'Litecoin',
    symbol: 'LTC',
    logoURI: 'https://assets.terra.money/icon/thorswap/LTC.svg',
    terraToken: '',
  },
  'BCH.BCH': {
    thorId: 'BCH.BCH',
    name: 'Bitcoin Cash',
    symbol: 'BCH',
    logoURI: 'https://assets.terra.money/icon/thorswap/BCH.svg',
    terraToken: '',
  },
  'DOGE.DOGE': {
    thorId: 'DOGE.DOGE',
    name: 'Dogecoin',
    symbol: 'DOGE',
    logoURI: 'https://assets.terra.money/icon/thorswap/DOGE.svg',
    terraToken: '',
  },
  'ETH.ETH': {
    thorId: 'ETH.ETH',
    name: 'Ethereum',
    symbol: 'ETH',
    logoURI: 'https://assets.terra.money/icon/thorswap/ETH.svg',
    terraToken: 'ETH',
  },
  'ETH.DAI-0X6B175474E89094C44DA98B954EEDEAC495271D0F': {
    thorId: 'ETH.DAI-0X6B175474E89094C44DA98B954EEDEAC495271D0F',
    name: 'Dai',
    symbol: 'DAI',
    logoURI: 'https://assets.terra.money/icon/thorswap/DAI.svg',
    terraToken: '0X6B175474E89094C44DA98B954EEDEAC495271D0F'.toLowerCase(),
  },
  'ETH.USDT-0XDAC17F958D2EE523A2206206994597C13D831EC7': {
    thorId: 'ETH.USDT-0XDAC17F958D2EE523A2206206994597C13D831EC7',
    name: 'Tether USD',
    symbol: 'USDT',
    logoURI: 'https://assets.terra.money/icon/thorswap/USDT.svg',
    terraToken: '0XDAC17F958D2EE523A2206206994597C13D831EC7'.toLowerCase(),
  },
  'ETH.WBTC-0X2260FAC5E5542A773AA44FBCFEDF7C193BC2C599': {
    thorId: 'ETH.WBTC-0X2260FAC5E5542A773AA44FBCFEDF7C193BC2C599',
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    logoURI: 'https://assets.terra.money/icon/thorswap/WBTC.svg',
    terraToken: '0X2260FAC5E5542A773AA44FBCFEDF7C193BC2C599'.toLowerCase(),
  },
  'ETH.AAVE-0X7FC66500C84A76AD7E9C93437BFC5AC33E2DDAE9': {
    thorId: 'ETH.AAVE-0X7FC66500C84A76AD7E9C93437BFC5AC33E2DDAE9',
    name: 'Aave',
    symbol: 'AAVE',
    logoURI: 'https://assets.terra.money/icon/thorswap/AAVE.svg',
    terraToken: '0X7FC66500C84A76AD7E9C93437BFC5AC33E2DDAE9'.toLowerCase(),
  },
  'ETH.SNX-0XC011A73EE8576FB46F5E1C5751CA3B9FE0AF2A6F': {
    thorId: 'ETH.SNX-0XC011A73EE8576FB46F5E1C5751CA3B9FE0AF2A6F',
    name: 'Synthetix',
    symbol: 'SNX',
    logoURI: 'https://assets.terra.money/icon/thorswap/SNX.svg',
    terraToken: '0XC011A73EE8576FB46F5E1C5751CA3B9FE0AF2A6F'.toLowerCase(),
  },
  'ETH.USDC-0XA0B86991C6218B36C1D19D4A2E9EB0CE3606EB48': {
    thorId: 'ETH.USDC-0XA0B86991C6218B36C1D19D4A2E9EB0CE3606EB48',
    name: 'USD Coin',
    symbol: 'USDC',
    logoURI: 'https://assets.terra.money/icon/thorswap/USDC.svg',
    terraToken: '0XA0B86991C6218B36C1D19D4A2E9EB0CE3606EB48'.toLowerCase(),
  },
  'ETH.YFI-0X0BC529C00C6401AEF6D220BE8C6EA1667F6AD93E': {
    thorId: 'ETH.YFI-0X0BC529C00C6401AEF6D220BE8C6EA1667F6AD93E',
    name: 'yearn.finance',
    symbol: 'YFI',
    logoURI: 'https://assets.terra.money/icon/thorswap/YFI.svg',
    terraToken: '0X0BC529C00C6401AEF6D220BE8C6EA1667F6AD93E'.toLowerCase(),
  },
  'BNB.BNB': {
    thorId: 'BNB.BNB',
    name: 'Binance Coin',
    symbol: 'BNB',
    logoURI: 'https://assets.terra.money/icon/thorswap/BNB.svg',
    terraToken: '',
  },
  'BNB.BTCB-1DE': {
    thorId: 'BNB.BTCB-1DE',
    name: 'Bitcoin BEP2',
    symbol: 'BTCB',
    logoURI: 'https://assets.terra.money/icon/thorswap/BTC.svg',
    terraToken: '',
  },
  'BNB.BUSD-BD1': {
    thorId: 'BNB.BUSD-BD1',
    name: 'Binance USD',
    symbol: 'BUSD',
    logoURI: 'https://assets.terra.money/icon/thorswap/BUSD.svg',
    terraToken: '',
  },
  'BNB.ETH-1C9': {
    thorId: 'BNB.ETH-1C9',
    name: 'Ethereum BEP2',
    symbol: 'ETH',
    logoURI: 'https://assets.terra.money/icon/thorswap/ETH.svg',
    terraToken: '',
  },
  'TERRA.LUNA': {
    thorId: 'TERRA.LUNA',
    name: 'Luna',
    symbol: 'LUNA',
    logoURI: 'https://assets.terra.money/icon/svg/Luna.svg',
    terraToken: 'uluna',
  },
  'TERRA.UST': {
    thorId: 'TERRA.UST',
    name: 'TerraUSD',
    symbol: 'UST',
    logoURI: 'https://assets.terra.money/icon/svg/Terra/UST.svg',
    terraToken: 'uusd',
  },
}

export async function getThorAssets(
  from: string,
  to: string
): Promise<{ toAssets: ThorAssetType[]; fromAssets: ThorAssetType[] }> {
  const { data } = await axios.get('https://midgard.thorswap.net/v2/pools')

  const unfilteredFromAssets: string[] = []
  const unfilteredToAssets: string[] = []

  data.forEach((pool: Pool) => {
    if (pool.status === 'available') {
      const assetChain = pool.asset.split('.')[0]
      if (assetChain === from) {
        unfilteredFromAssets.push(pool.asset)
      }
      if (assetChain === to) {
        unfilteredToAssets.push(pool.asset)
      }
    }
  })

  const fromAssets: ThorAssetType[] = []
  unfilteredFromAssets.forEach((asset: string) => {
    thorAssets[asset] && fromAssets.push(thorAssets[asset])
  })
  // use native asset as default one
  fromAssets.forEach((item, i): void => {
    if (item.thorId === `${from}.${from}` || item.thorId === `TERRA.UST`) {
      fromAssets.splice(i, 1)
      fromAssets.unshift(item)
    }
  })

  const toAssets: ThorAssetType[] = []
  unfilteredToAssets.forEach((asset: string) => {
    thorAssets[asset] && toAssets.push(thorAssets[asset])
  })
  // use native asset as default one
  toAssets.forEach((item, i): void => {
    if (item.thorId === `${to}.${to}` || item.thorId === `TERRA.UST`) {
      toAssets.splice(i, 1)
      toAssets.unshift(item)
    }
  })

  return {
    fromAssets,
    toAssets,
  }
}
