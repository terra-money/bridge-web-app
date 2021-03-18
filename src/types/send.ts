import { StdFee } from '@terra-money/terra.js'
import { ethers } from 'ethers'

import { AssetType } from './asset'
import { BlockChainType } from './network'

export type SendProps = {
  asset: AssetType
  toAddress: string
  toBlockChain: BlockChainType
  amount: string
  memo: string
  gasPrices?: Record<string, string>
  fee?: StdFee
}

// just request transaction, it's not finished
export type RequestTxResultType =
  | {
      success: true
      hash: string
    }
  | {
      success: false
      errorMessage?: string
    }

export type TerraReceiptResultType = {}

export type EtherBaseReceiptResultType = ethers.providers.TransactionReceipt

export type ValidateItemResultType = {
  isValid: boolean
  errorMessage?: string
}

export type ValidateResultType = {
  isValid: boolean
  errorMessage?: {
    toAddress?: string
    amount?: string
    memo?: string
  }
}
