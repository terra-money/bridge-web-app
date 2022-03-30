import { BlockChainType } from 'types'
import axios from 'axios'

// get current ethereum chain gas price
export default async function getWormholeFees(
  toBlockChain: BlockChainType,
  asset: string
): Promise<number> {
  let feeUsd = 0
  switch (toBlockChain) {
    case BlockChainType.bsc:
    case BlockChainType.avalanche:
    case BlockChainType.terra:
      feeUsd = 2
      break
    case BlockChainType.polygon:
    case BlockChainType.fantom:
      feeUsd = 0.5
      break
    case BlockChainType.ethereum:
      // TODO: calculate ethereum fees
      feeUsd = 40
  }

  // get transferred token exchange rate
  let exchangeRate = 1
  const { data } = await axios.get(
    'https://lcd.terra.dev/terra/oracle/v1beta1/denoms/exchange_rates'
  )
  data['exchange_rates'].forEach((coin: { denom: string; amount: string }) => {
    if (coin.denom === asset) {
      exchangeRate *= parseFloat(coin.amount)
    }
    if (coin.denom === 'uusd') {
      exchangeRate /= parseFloat(coin.amount)
    }
  })
  // TODO: decimals for non-terra tokens
  return feeUsd * exchangeRate * 1e6
}
