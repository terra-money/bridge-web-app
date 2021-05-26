import { IWalletConnectOptions, IPushServerOptions } from '@walletconnect/types'
import * as cryptoLib from '@walletconnect/iso-crypto'
import { TerraWalletconnectQrcodeModal } from 'components/WalletConnectQrCodeModal'

import Connector from 'packages/walletconnect/core'

export class WalletConnect extends Connector {
  constructor(
    connectorOpts: IWalletConnectOptions,
    pushServerOpts?: IPushServerOptions
  ) {
    super({
      cryptoLib,
      connectorOpts,
      pushServerOpts,
    })
  }
}

const connect = async (): Promise<WalletConnect> => {
  // bridge url
  const bridge = 'https://walletconnect.terra.dev/'

  // create new connector
  const connector = new WalletConnect({
    bridge,
    qrcodeModal: new TerraWalletconnectQrcodeModal(),
  })

  // check if already connected
  if (!connector.connected) {
    // create new session
    await connector.createSession()
  }

  return connector
}

export default { connect }
