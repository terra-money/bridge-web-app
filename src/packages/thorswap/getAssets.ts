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

const thorAssets: Record<string, ThorAssetType> = {
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
  'BNB.BNB': {
    thorId: 'BNB.BNB',
    name: 'Binance Coin',
    symbol: 'BNB',
    logoURI: 'https://assets.terra.money/icon/thorswap/BNB.svg',
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

  return assets
}
