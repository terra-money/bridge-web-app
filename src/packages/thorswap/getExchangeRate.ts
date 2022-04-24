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

export default async function getExchangeRate(
  from: string,
  to: string
): Promise<number> {
  if (!from || !to) {
    // to or from pool not available
    return 0
  }
  const { data: fromData }: { data: Pool } = await axios.get(
    'https://midgard.thorchain.info/v2/pool/' + from
  )
  const { data: toData }: { data: Pool } = await axios.get(
    'https://midgard.thorchain.info/v2/pool/' + to
  )

  if (!fromData.assetPriceUSD || !toData.assetPriceUSD) {
    // to or from pool not available
    return 0
  }

  return parseFloat(fromData.assetPriceUSD) / parseFloat(toData.assetPriceUSD)
}
