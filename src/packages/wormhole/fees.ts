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
      // fetch eth price
      const {
        data: { ethereum },
      } = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
      )
      // eth gas price from alchemy
      const {
        data: { result: gas_price },
      } = await axios.post(
        'https://eth-mainnet.alchemyapi.io/v2/_9jvtNUzoLW1EHR380VZP7GUZaqXvmG3',
        {
          jsonrpc: '2.0',
          method: 'eth_gasPrice',
          params: [],
          id: 1,
        }
      )

      feeUsd = ((280_000 * gas_price) / 1e18) * ethereum.usd
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
  return Math.round(feeUsd * exchangeRate * 1e6 * 1.15)
}
