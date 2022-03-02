import { WalletConnect } from 'services/terraWalletConnectService'
import { ethers } from 'ethers'
import { WalletEnum } from './wallet'
import { SigningStargateClient } from '@cosmjs/stargate'

export type User = {
  address: string
  terraWalletConnect?: WalletConnect
  provider?: ethers.providers.Web3Provider
  signer?: SigningStargateClient
  walletType: WalletEnum
}
