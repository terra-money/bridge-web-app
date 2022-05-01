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
  if (!from || !to) return 0

  let fromData: Pool | null = null
  let toData: Pool | null = null

  const { data } = await axios.get('https://midgard.thorchain.info/v2/pools')

  data.forEach((d: Pool): void => {
    if (d.asset === from) fromData = d
    if (d.asset === to) toData = d
  })

  if (!fromData || !toData) return 0

  // @ts-expect-error
  return parseFloat(fromData.assetPrice) / parseFloat(toData.assetPrice)
}
