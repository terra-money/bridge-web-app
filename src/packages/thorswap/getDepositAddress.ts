import axios from 'axios'

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

export default async function getDepositAddress(
  from: string,
  to: string
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
    if (chain.chain === from) {
      status.from = chain.halted
      status.address = chain.address
    } else if (chain.chain === to) {
      status.to = chain.halted
    }
  })

  return { address: status.address, isHalted: status.from || status.to }
}
