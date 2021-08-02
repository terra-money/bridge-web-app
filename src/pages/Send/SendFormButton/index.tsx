import { ReactElement } from 'react'
import { useRecoilValue } from 'recoil'

import { ValidateItemResultType } from 'types/send'

import { Button } from 'components'
import useSelectWallet from 'hooks/useSelectWallet'

import AuthStore from 'store/AuthStore'
import SendProcessStore, { ProcessStatus } from 'store/SendProcessStore'

import SubmitButton from './SubmitButton'
import NextOrApproveButton from './NextOrApproveButton'

const SendFormButton = ({
  feeValidationResult,
}: {
  feeValidationResult: ValidateItemResultType
}): ReactElement => {
  const selectWallet = useSelectWallet()
  const isLoggedIn = useRecoilValue(AuthStore.isLoggedIn)
  const status = useRecoilValue(SendProcessStore.sendProcessStatus)

  if (isLoggedIn) {
    return status === ProcessStatus.Input ? (
      <NextOrApproveButton feeValidationResult={feeValidationResult} />
    ) : (
      <SubmitButton />
    )
  }

  return <Button onClick={selectWallet.open}>Connect Wallet</Button>
}

export default SendFormButton
