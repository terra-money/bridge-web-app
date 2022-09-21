import { ReactElement, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { LockFill } from 'react-bootstrap-icons'
import { CircularProgress } from '@material-ui/core'

import { COLOR } from 'consts'

import { RequestTxResultType, ValidateItemResultType } from 'types/send'
import useSend from 'hooks/useSend'

import { Button, Row } from 'components'

import SendStore from 'store/SendStore'
import SendProcessStore, { ProcessStatus } from 'store/SendProcessStore'
import FormErrorMessage from 'components/FormErrorMessage'

const NextOrApproveButton = ({
  feeValidationResult,
}: {
  feeValidationResult: ValidateItemResultType
}): ReactElement => {
  const setStatus = useSetRecoilState(SendProcessStore.sendProcessStatus)

  const amount = useRecoilValue(SendStore.amount)

  const [waitingForApprove, setWaitingForApprove] = useState(false)
  const [approveResult, setApproveResult] = useState<RequestTxResultType>()
  const { allowanceOfSelectedAsset, approveTxFromEtherBase } = useSend()

  const onClickApproveTxFromEtherBase = async (): Promise<void> => {
    setWaitingForApprove(true)
    setApproveResult(undefined)
    const res = await approveTxFromEtherBase()
    setApproveResult(res)
    setWaitingForApprove(false)
  }

  const onClickSendNextButton = async (): Promise<void> => {
    setStatus(ProcessStatus.Confirm)
  }

  if (
    allowanceOfSelectedAsset.isNeedApprove &&
    allowanceOfSelectedAsset.allowance.isLessThan(amount)
  ) {
    return (
      <>
        <Button
          onClick={onClickApproveTxFromEtherBase}
          disabled={waitingForApprove}
        >
          {waitingForApprove ? (
            <CircularProgress size={20} style={{ color: COLOR.darkGray2 }} />
          ) : (
            <Row style={{ justifyContent: 'center' }}>
              <LockFill style={{ paddingRight: 5 }} /> Unlock token to send
            </Row>
          )}
        </Button>
        {false === approveResult?.success && (
          <FormErrorMessage
            errorMessage={approveResult.errorMessage}
            style={{ display: 'block', textAlign: 'center', marginTop: 10 }}
          />
        )}
      </>
    )
  }

  return (
    <Button onClick={onClickSendNextButton} disabled={true}>
      Not available
    </Button>
  )
}

export default NextOrApproveButton
