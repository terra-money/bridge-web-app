import { ethers } from 'ethers'

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
    asset?: string
  }
}
