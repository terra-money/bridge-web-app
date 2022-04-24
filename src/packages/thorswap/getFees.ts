import axios from 'axios'
import { BlockChainType } from 'types'
import getExchangeRate from './getExchangeRate'
import { nativeThorAsset, thorChainName, ThorBlockChains } from './thorNames'

interface ChainProps {
  chain: string
  pub_key: string
  address: string
  halted: boolean
  gas_rate: string
}

// https://dev.thorchain.org/thorchain-dev/thorchain-and-fees
export async function getThorOutboundFees(
  blockchain: BlockChainType,
  toAsset: string
): Promise<number> {
  // get gas rate
  const { data }: { data: ChainProps[] } = await axios.get(
    'https://midgard.thorswap.net/v2/thorchain/inbound_addresses'
  )
  const [chainData] = data.filter(
    (c) => c.chain === thorChainName[blockchain as ThorBlockChains]
  )
  const gasRate = parseInt(chainData.gas_rate)

  // get exchange rate
  const exchangeRate = await getExchangeRate(
    nativeThorAsset[blockchain as ThorBlockChains],
    toAsset
  )
  console.log(exchangeRate)

  switch (blockchain) {
    case BlockChainType.bsc:
      return (gasRate / 1e7) * exchangeRate
    case BlockChainType.bitcoin:
      return (gasRate / 1e8) * 250 * exchangeRate
    case BlockChainType.ethereum:
      if (toAsset === nativeThorAsset[blockchain as ThorBlockChains]) {
        return (gasRate / 1e9) * 35000 * exchangeRate
      } else {
        // ERC20 (need more gas)
        return (gasRate / 1e9) * 70000 * exchangeRate
      }
    case BlockChainType.terra:
      return (gasRate / 1e8) * exchangeRate
  }
  return 0
}
