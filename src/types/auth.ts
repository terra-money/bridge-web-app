import { ethers } from 'ethers'
import { BlockChainType } from './network'
import { WalletEnum } from './wallet'

export type User =
  | {
      blockChain: BlockChainType.terra
      address: string
      walletType: WalletEnum
    }
  | {
      blockChain: BlockChainType.ethereum | BlockChainType.bsc
      address: string
      provider: ethers.providers.Web3Provider
      walletType: WalletEnum
    }
