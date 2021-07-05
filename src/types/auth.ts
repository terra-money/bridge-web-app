import { WalletConnect } from 'services/terraWalletConnectService'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { ethers } from 'ethers'
import { WalletEnum } from './wallet'

export type User = {
  address: string
  terraWalletConnect?: WalletConnect
  walletConnect?: WalletConnectProvider
  provider?: ethers.providers.Web3Provider
  walletType: WalletEnum
}
