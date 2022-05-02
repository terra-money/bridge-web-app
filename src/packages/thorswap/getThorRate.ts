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

// Calculate swap output with slippage
function calcSwapOutput(
  inputAmount: number,
  pool: Pool,
  toRune: boolean
): number {
  const runeBalance = parseInt(pool.runeDepth) / 1e8
  const assetBalance = parseInt(pool.assetDepth) / 1e8
  // formula: (inputAmount * inputBalance * outputBalance) / (inputAmount + inputBalance) ^ 2
  const inputBalance = toRune ? assetBalance : runeBalance // input is asset if toRune
  const outputBalance = toRune ? runeBalance : assetBalance // output is rune if toRune
  const numerator = inputAmount * inputBalance * outputBalance
  const denominator = Math.pow(inputAmount + inputBalance, 2)
  const result = numerator / denominator
  return result
}

interface ThorRateResult {
  rate: number
  fromRateUsd: number
  toRateUsd: number
  output?: number
}

export default async function getSwapOutput(
  from: string,
  to: string,
  amount?: number
): Promise<ThorRateResult> {
  if (!from || !to) {
    return { rate: 0, fromRateUsd: 0, toRateUsd: 0 }
  }
  const { data } = await axios.get('https://midgard.thorchain.info/v2/pools')

  let fromData: Pool | undefined = undefined
  let toData: Pool | undefined = undefined

  data.forEach((d: Pool): void => {
    if (d.asset === from && d.status === 'available') fromData = d
    else if (d.asset === to && d.status === 'available') toData = d
  })

  if (!fromData || !toData) {
    return { rate: 0, fromRateUsd: 0, toRateUsd: 0 }
  }

  const fromPool = fromData as Pool
  const toPool = toData as Pool

  const rate = parseFloat(fromPool.assetPrice) / parseFloat(toPool.assetPrice)

  if (!amount)
    return {
      rate,
      fromRateUsd: parseFloat(fromPool.assetPriceUSD),
      toRateUsd: parseFloat(toPool.assetPriceUSD),
    }

  const runeAmount = calcSwapOutput(amount, fromPool, true)
  const output = calcSwapOutput(runeAmount, toPool, false)

  return {
    output,
    rate,
    fromRateUsd: parseFloat(fromPool.assetPriceUSD),
    toRateUsd: parseFloat(toPool.assetPriceUSD),
  }
}
