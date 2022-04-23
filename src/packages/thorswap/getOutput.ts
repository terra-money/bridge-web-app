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

export default async function getSwapOutput(
  from: string,
  to: string,
  amount: number
): Promise<Number> {
  const { data } = await axios.get('https://midgard.thorswap.net/v2/pools')

  const result = {
    from: undefined as Pool | undefined,
    to: undefined as Pool | undefined,
  }

  data.forEach((pool: Pool) => {
    if (pool.asset === from && pool.status === 'available') {
      result.from = pool
    } else if (pool.asset === to && pool.status === 'available') {
      result.to = pool
    }
  })

  if (!result.from || !result.to) {
    // to or from pool not available
    return 0
  }

  const runeAmount = calcSwapOutput(amount, result.from, true)
  console.log(`${amount} ${from} -> ${runeAmount} RUNE`)

  const simulationResult = calcSwapOutput(runeAmount, result.to, false)
  console.log(`${runeAmount} RUNE -> ${simulationResult} ${to}`)

  return simulationResult
}
