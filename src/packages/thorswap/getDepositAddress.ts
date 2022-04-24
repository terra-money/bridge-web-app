import axios from 'axios'
import { BlockChainType } from 'types'
import { ThorBlockChains, thorChainName } from './thorNames'

interface ChainProps {
  chain: string
  pub_key: string
  address: string
  halted: boolean
  gas_rate: string
}

interface StatusProps {
  address: string
  isHalted: boolean
}

export default async function getThorDepositAddress(
  from: BlockChainType,
  to: BlockChainType
): Promise<StatusProps> {
  const { data } = await axios.get(
    'https://midgard.thorswap.net/v2/thorchain/inbound_addresses'
  )

  const status = {
    from: true,
    to: true,
    address: '',
  }

  data.forEach((chain: ChainProps) => {
    if (chain.chain === thorChainName[from as ThorBlockChains]) {
      status.from = chain.halted
      status.address = chain.address
    } else if (chain.chain === thorChainName[to as ThorBlockChains]) {
      status.to = chain.halted
    }
  })

  return { address: status.address, isHalted: status.from || status.to }
}
