import { useRecoilValue } from 'recoil'
import { AccAddress } from '@terra-money/terra.js'
import { ethers } from 'ethers'
import _ from 'lodash'
import BigNumber from 'bignumber.js'

import SendStore from 'store/SendStore'

import { BlockChainType } from 'types/network'
import { ValidateItemResultType, ValidateResultType } from 'types/send'

import useAsset from './useAsset'
import { NETWORK } from 'consts'

const useSendValidate = (): {
  validateFee: () => ValidateItemResultType
  validateSendData: () => ValidateResultType
} => {
  const { formatBalance } = useAsset()

  // Send Data
  const asset = useRecoilValue(SendStore.asset)
  const toAddress = useRecoilValue(SendStore.toAddress)
  const amount = useRecoilValue(SendStore.amount)
  const memo = useRecoilValue(SendStore.memo)
  const toBlockChain = useRecoilValue(SendStore.toBlockChain)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)

  const assetList = useRecoilValue(SendStore.loginUserAssetList)
  const feeDenom = useRecoilValue(SendStore.feeDenom)

  const gasFee = useRecoilValue(SendStore.gasFee)
  const tax = useRecoilValue(SendStore.tax)

  const validateFee = (): ValidateItemResultType => {
    if (fromBlockChain === BlockChainType.terra) {
      const sendAmount = new BigNumber(amount)
      const selectedAssetAmount = new BigNumber(
        assetList.find((x) => x.tokenAddress === asset?.tokenAddress)
          ?.balance || '0'
      )
      const gasFeeIfSameDenomWithSendAsset =
        asset?.tokenAddress === feeDenom ? gasFee : new BigNumber(0)
      const taxAmount = new BigNumber(tax?.amount.toString() || 0)

      if (
        selectedAssetAmount.isLessThan(
          taxAmount.plus(sendAmount).plus(gasFeeIfSameDenomWithSendAsset)
        )
      ) {
        return {
          isValid: false,
          errorMessage: 'Insufficient balance',
        }
      }
    }

    return { isValid: true }
  }

  const validateAsset = (): ValidateItemResultType => {
    if (asset?.disabled) {
      return {
        isValid: false,
        errorMessage: `${asset.symbol} is not available on ${NETWORK.blockChainName[toBlockChain]}`,
      }
    }

    return { isValid: true }
  }

  const validateMemo = (): ValidateItemResultType => {
    if (_.isEmpty(memo)) {
      return { isValid: true, errorMessage: '' }
    }

    if (_.size(memo) >= 256) {
      return {
        isValid: false,
        errorMessage: 'Memo must be shorter than 256 bytes.',
      }
    }

    return { isValid: true }
  }

  const validateToAddress = (): ValidateItemResultType => {
    if (_.isEmpty(toAddress)) {
      return { isValid: false, errorMessage: '' }
    }

    let validAddress = false
    switch (toBlockChain) {
      case BlockChainType.terra:
        validAddress = AccAddress.validate(toAddress)
        break
      case BlockChainType.secret:
        validAddress = true // TODO : check if it's valid address
        break
      default:
        validAddress = ethers.utils.isAddress(toAddress)
        break
    }

    if (false === validAddress) {
      return { isValid: false, errorMessage: 'Invalid address' }
    }

    return { isValid: true }
  }

  const validateAmount = (): ValidateItemResultType => {
    if (_.isEmpty(amount)) {
      return { isValid: false, errorMessage: '' }
    }

    const bnAmount = new BigNumber(amount)

    if (_.isNaN(bnAmount) || bnAmount.isNegative() || bnAmount.isZero()) {
      return { isValid: false, errorMessage: 'Amount must be greater than 0' }
    }

    const rebalanceDecimal =
      fromBlockChain === BlockChainType.terra || BlockChainType.secret
        ? 1
        : 1e12

    if (false === bnAmount.div(rebalanceDecimal).isInteger()) {
      return {
        isValid: false,
        errorMessage: `Amount must be within 6 decimal points`,
      }
    }

    const selectedAssetAmount = new BigNumber(
      assetList.find((x) => x.tokenAddress === asset?.tokenAddress)?.balance ||
        '0'
    )
    if (selectedAssetAmount.isLessThanOrEqualTo(0)) {
      return {
        isValid: false,
        errorMessage: 'Insufficient balance',
      }
    }

    if (bnAmount.isGreaterThan(selectedAssetAmount)) {
      return {
        isValid: false,
        errorMessage: `Amount must be between 0 and ${formatBalance(
          selectedAssetAmount.toString()
        )}`,
      }
    }

    return { isValid: true }
  }

  const validateSendData = (): ValidateResultType => {
    const toAddressValidResult = validateToAddress()
    const amountValidResult = validateAmount()
    const memoValidResult = validateMemo()
    const assetValidResult = validateAsset()

    return {
      isValid: _.every(
        [
          toAddressValidResult,
          amountValidResult,
          memoValidResult,
          assetValidResult,
        ],
        (x) => x.isValid
      ),
      errorMessage: {
        toAddress: toAddressValidResult.errorMessage,
        amount: amountValidResult.errorMessage,
        memo: memoValidResult.errorMessage,
        asset: assetValidResult.errorMessage,
      },
    }
  }

  return {
    validateFee,
    validateSendData,
  }
}

export default useSendValidate
