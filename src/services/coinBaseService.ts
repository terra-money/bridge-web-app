import { WalletLinkConnector } from '@web3-react/walletlink-connector'

import { NETWORK } from 'consts'

const connect = async (): Promise<{
  address: string
  provider: any
}> => {
  const connector = new WalletLinkConnector({
    // url: `https://ropsten.infura.io/v3/${NETWORK.INFURAID}`,
    url: `https://mainnet.infura.io/v3/${NETWORK.INFURAID}`,
    appName: 'bridge',
  })
  const { account, provider } = await connector.activate()
  const address = account || ''
  return { address, provider }
}
export default { connect }
