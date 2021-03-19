import { ethers } from 'ethers'
import { WalletEnum } from './wallet'

export type User = {
  address: string
  provider?: ethers.providers.Web3Provider
  walletType: WalletEnum
}
