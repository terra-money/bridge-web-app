import { ReactElement } from 'react'
import { useRecoilValue } from 'recoil'

import { isMobile } from 'react-device-detect'

import { BlockChainType } from 'types/network'
import { ValidateItemResultType, ValidateResultType } from 'types/send'

import { Button } from 'components'
import useSelectWallet from 'hooks/useSelectWallet'

import AuthStore from 'store/AuthStore'
import SendStore from 'store/SendStore'

const SendFormButton = ({
  validationResult,
  onClickSendButton,
  isValidGasFee,
  isValidTax,
}: {
  validationResult: ValidateResultType
  onClickSendButton: () => Promise<void>
  isValidGasFee: ValidateItemResultType
  isValidTax: ValidateItemResultType
}): ReactElement => {
  const selectWallet = useSelectWallet()
  const isLoggedIn = useRecoilValue(AuthStore.isLoggedIn)

  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)

  let ableButton =
    fromBlockChain === BlockChainType.terra
      ? validationResult.isValid && isValidGasFee.isValid && isValidTax.isValid
      : validationResult.isValid

  return isLoggedIn ? (
    <Button onClick={onClickSendButton} disabled={!ableButton}>
      Next
    </Button>
  ) : (
    <Button disabled={isMobile} onClick={selectWallet.open}>
      Connect Wallet
    </Button>
  )
}

export default SendFormButton
