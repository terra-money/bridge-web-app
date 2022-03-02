import { SigningStargateClient } from '@cosmjs/stargate'
import _ from 'lodash'
import { Keplr } from '@keplr-wallet/types'
import { getKeplrFromWindow } from '@keplr-wallet/stores'
import { BlockChainType, ibcChainId, IbcNetwork, ibcRpc } from 'types'


const checkInstalled = (): boolean => {
  return _.some(window.keplr)
}

const connect = async (chain: BlockChainType): Promise<{
  address: string
  signingCosmosClient: SigningStargateClient
}> => {
  const keplr = await getKeplrFromWindow() as Keplr
  const CHAIN_ID = ibcChainId[chain as IbcNetwork]
  keplr.enable(CHAIN_ID)
  const keplrOfflineSigner = await keplr.getOfflineSignerAuto(CHAIN_ID)
  const accounts = await keplrOfflineSigner.getAccounts()
  const address = accounts[0].address

  const signingCosmosClient = await SigningStargateClient.connectWithSigner(
    ibcRpc[chain as IbcNetwork],
    keplrOfflineSigner,
  )
  
  return { address, signingCosmosClient }
}

export default { connect, checkInstalled }