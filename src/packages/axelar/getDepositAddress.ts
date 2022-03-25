import { AssetInfoWithTrace } from '@axelar-network/axelarjs-sdk'
import { AxelarAPI } from './axelarAPI'
import { getParameters } from './getParameters'
import { Wallet } from 'ethers'
import { BlockChainType } from 'types'

const api = new AxelarAPI('mainnet')
const signerAuthority = Wallet.createRandom()

export async function getDepositAddress(
  destinationAddress: string,
  fromBlockChain: BlockChainType,
  toBlockChain: BlockChainType,
  coin: string
): Promise<string | undefined> {
  const signerAuthorityAddress = await signerAuthority.getAddress()
  const { validationMsg, otc } = await api.getOneTimeMessageToSign(
    signerAuthorityAddress
  )

  const signature = await signerAuthority.signMessage(validationMsg)

  const publicAddr = await signerAuthority.getAddress()

  const parameters = getParameters(
    destinationAddress,
    fromBlockChain,
    toBlockChain,
    coin
  )
  parameters.otc = otc
  parameters.publicAddr = publicAddr
  parameters.signature = signature

  const linkAddressInfo: AssetInfoWithTrace = await api.getDepositAddress(
    parameters
  )
  if (linkAddressInfo?.assetInfo?.assetAddress)
    return linkAddressInfo?.assetInfo?.assetAddress
}
