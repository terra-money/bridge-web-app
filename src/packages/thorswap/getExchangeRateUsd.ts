import axios from 'axios'

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

export default async function getExchangeRateUsd(
  asset: string
): Promise<number> {
  const {
    data,
  }: {
    data: Pool
  } = await axios.get('https://midgard.thorchain.info/v2/pool/' + asset)

  return parseFloat(data.assetPriceUSD)
}
