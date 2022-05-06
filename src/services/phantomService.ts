// import _ from 'lodash'

import { PublicKey, Transaction } from '@solana/web3.js'

type DisplayEncoding = 'utf8' | 'hex'
type PhantomEvent = 'disconnect' | 'connect' | 'accountChanged'
type PhantomRequestMethod =
  | 'connect'
  | 'disconnect'
  | 'signTransaction'
  | 'signAllTransactions'
  | 'signMessage'

interface ConnectOpts {
  onlyIfTrusted: boolean
}

interface PhantomProvider {
  publicKey: PublicKey | null
  isConnected: boolean | null
  signTransaction: (transaction: Transaction) => Promise<Transaction>
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>
  signMessage: (
    message: Uint8Array | string,
    display?: DisplayEncoding
  ) => Promise<any>
  connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>
  disconnect: () => Promise<void>
  on: (event: PhantomEvent, handler: (args: any) => void) => void
  request: (method: PhantomRequestMethod, params: any) => Promise<unknown>
}

const getProvider = (): PhantomProvider | undefined => {
  if ('solana' in window) {
    // @ts-ignore
    const provider = window.solana as any
    if (provider.isPhantom) return provider as PhantomProvider
  }
}

const checkInstalled = (): boolean => {
  const provider = getProvider()
  return provider ? true : false
}

const connect = async (): Promise<{
  address: string
  provider: any
}> => {
  // @ts-ignore
  const { solana } = window
  const provider = getProvider()
  let address
  if (solana) {
    try {
      const response = await solana.connect()
      address = response.publicKey.toString()
    } catch (err) {
      // { code: 4001, message: 'User rejected the request.' }
    }
  }
  return { address, provider }
}
export default { connect, checkInstalled }
