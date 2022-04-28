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
): Promise<number> {
  if (!from || !to) return 0

  const { data } = await axios.get('https://midgard.thorchain.info/v2/pools')

  let fromData: Pool | undefined = undefined
  let toData: Pool | undefined = undefined

  data.forEach((d: Pool): void => {
    if (d.asset === from) fromData = d
    else if (d.asset === to) toData = d
  })

  if (
    !fromData ||
    // @ts-expect-error
    fromData.status !== 'available' ||
    !toData ||
    // @ts-expect-error
    toData.status !== 'available'
  )
    return 0

  const runeAmount = calcSwapOutput(amount, fromData, true)
  const simulationResult = calcSwapOutput(runeAmount, toData, false)
  return simulationResult
}
