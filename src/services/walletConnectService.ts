import WalletConnectProvider from '@walletconnect/web3-provider'

import { NETWORK } from 'consts'

const connect = async (): Promise<{
  address: string
  provider: WalletConnectProvider
}> => {
  const provider = new WalletConnectProvider({
    infuraId: NETWORK.INFURAID,
  })
  const [address] = await provider.enable()

  return { address, provider }
}
export default { connect }
