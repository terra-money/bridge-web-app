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
    terraToken: '',
  },
  'ETH.ETH': {
    thorId: 'ETH.ETH',
    name: 'Ethereum',
    symbol: 'ETH',
    logoURI: 'https://assets.terra.money/icon/thorswap/ETH.svg',
    terraToken: '',
  },
  'ETH.DAI-0X6B175474E89094C44DA98B954EEDEAC495271D0F': {
    thorId: 'ETH.DAI-0X6B175474E89094C44DA98B954EEDEAC495271D0F',
    name: 'Dai',
    symbol: 'DAI',
    logoURI: 'https://assets.terra.money/icon/thorswap/DAI.svg',
    terraToken: '',
  },
  'ETH.USDT-0XDAC17F958D2EE523A2206206994597C13D831EC7': {
    thorId: 'ETH.USDT-0XDAC17F958D2EE523A2206206994597C13D831EC7',
    name: 'Tether USD',
    symbol: 'USDT',
    logoURI: 'https://assets.terra.money/icon/thorswap/USDT.svg',
    terraToken: '',
  },
  'ETH.WBTC-0X2260FAC5E5542A773AA44FBCFEDF7C193BC2C599': {
    thorId: 'ETH.WBTC-0X2260FAC5E5542A773AA44FBCFEDF7C193BC2C599',
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    logoURI: 'https://assets.terra.money/icon/thorswap/WBTC.svg',
    terraToken: '',
  },
  'ETH.AAVE-0X7FC66500C84A76AD7E9C93437BFC5AC33E2DDAE9': {
    thorId: 'ETH.AAVE-0X7FC66500C84A76AD7E9C93437BFC5AC33E2DDAE9',
    name: 'Aave',
    symbol: 'AAVE',
    logoURI: 'https://assets.terra.money/icon/thorswap/AAVE.svg',
    terraToken: '',
  },
  'ETH.SNX-0XC011A73EE8576FB46F5E1C5751CA3B9FE0AF2A6F': {
    thorId: 'ETH.SNX-0XC011A73EE8576FB46F5E1C5751CA3B9FE0AF2A6F',
    name: 'Synthetix',
    symbol: 'SNX',
    logoURI: 'https://assets.terra.money/icon/thorswap/SNX.svg',
    terraToken: '',
  },
  'ETH.USDC-0XA0B86991C6218B36C1D19D4A2E9EB0CE3606EB48': {
    thorId: 'ETH.USDC-0XA0B86991C6218B36C1D19D4A2E9EB0CE3606EB48',
    name: 'USD Coin',
    symbol: 'USDC',
    logoURI: 'https://assets.terra.money/icon/thorswap/USDC.svg',
    terraToken: '',
  },
  'ETH.YFI-0X0BC529C00C6401AEF6D220BE8C6EA1667F6AD93E': {
    thorId: 'ETH.YFI-0X0BC529C00C6401AEF6D220BE8C6EA1667F6AD93E',
    name: 'yearn.finance',
    symbol: 'YFI',
    logoURI: 'https://assets.terra.money/icon/thorswap/YFI.svg',
    terraToken: '',
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

export async function getThorAssets(chain: string): Promise<ThorAssetType[]> {
  const { data } = await axios.get('https://midgard.thorswap.net/v2/pools')

  const unfilteredAssets: string[] = []

  data.forEach((pool: Pool) => {
    if (pool.status === 'available' && pool.asset.split('.')[0] === chain) {
      unfilteredAssets.push(pool.asset)
    }
  })

  const assets: ThorAssetType[] = []
  unfilteredAssets.forEach((asset: string) => {
    thorAssets[asset] && assets.push(thorAssets[asset])
  })

  // use native asset as default one
  assets.forEach((item, i): void => {
    if (item.thorId === `${chain}.${chain}`) {
      assets.splice(i, 1)
      assets.unshift(item)
    }
  })

  return assets
}
