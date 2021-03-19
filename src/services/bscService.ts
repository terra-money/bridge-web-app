import { BscConnector } from '@binance-chain/bsc-connector'
import _ from 'lodash'

const checkInstalled = (): boolean => {
  return _.some(window.BinanceChain)
}

const connect = async (): Promise<{
  address: string
  provider: any
}> => {
  const connector = new BscConnector({ supportedChainIds: [56, 97] })

  const { account, provider } = await connector.activate()
  const address = account || ''
  return { address, provider }
}
export default { connect, checkInstalled }
