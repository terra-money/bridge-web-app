import { AxelarAssetTransfer, Environment } from '@axelar-network/axelarjs-sdk'

import { BlockChainType } from 'types'

const sdk = new AxelarAssetTransfer({
  environment: Environment.MAINNET,
  auth: 'local',
})

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
    coin
  )
}

export async function getAxelarFee(
  fromBlockChain: BlockChainType,
  toBlockChain: BlockChainType,
  coin: string
): Promise<number> {
  return 1
}
