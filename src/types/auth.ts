import { WalletConnect } from 'services/terraWalletConnectService'
import { ethers } from 'ethers'
import { WalletEnum } from './wallet'

export type User = {
  address: string
  terraWalletConnect?: WalletConnect
  provider?: ethers.providers.Web3Provider
  walletType: WalletEnum
}
