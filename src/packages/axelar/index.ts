import { AxelarAssetTransfer, Environment } from '@axelar-network/axelarjs-sdk'
import axios from 'axios'

import { BlockChainType } from 'types'

const sdk = new AxelarAssetTransfer({
  environment: Environment.MAINNET,
  auth: 'local',
})

const tokens: Record<string, string> = {
  'ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4':
    'uusdc',
  'ibc/CBF67A2BCF6CAE343FDF251E510C8E18C361FC02B23430C121116E0811835DEF':
    'uusdt',
  'ibc/05D299885B07905B6886F554B39346EA6761246076A1120B1950049B92B922DD':
    'wbtc-satoshi',
  'ibc/BC8A77AFBD872FDC32A348D3FB10CC09277C266CFE52081DE341C7EC6752E674':
    'weth-wei',
}

const networks: Record<string, string> = {
  [BlockChainType.terra]: 'terra-2',
  [BlockChainType.ethereum]: 'ethereum',
}

export async function getDepositAddress(
  destinationAddress: string,
  fromBlockChain: BlockChainType,
  toBlockChain: BlockChainType,
  coin: string
): Promise<string | undefined> {
  return await sdk.getDepositAddress(
    fromBlockChain,
    toBlockChain,
    destinationAddress,
    tokens[coin]
  )
}

export async function getAxelarFee(
  fromBlockChain: BlockChainType,
  toBlockChain: BlockChainType,
  coin: string,
  amount: number
): Promise<string> {
  const result = await axios.get(
    `https://api-1.axelar.nodes.guru/axelar/nexus/v1beta1/transfer_fee?source_chain=${networks[fromBlockChain]}&destination_chain=${networks[toBlockChain]}&amount=${amount}${tokens[coin]}`
  )

  return result.data.fee.amount
}
