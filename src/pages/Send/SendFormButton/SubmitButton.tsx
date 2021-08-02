import { ReactElement, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import _ from 'lodash'
import { CircularProgress } from '@material-ui/core'

import { COLOR } from 'consts'
import { BlockChainType } from 'types/network'
import { RequestTxResultType } from 'types/send'

import { Button } from 'components'
import SendStore from 'store/SendStore'
import SendProcessStore, { ProcessStatus } from 'store/SendProcessStore'
import FormErrorMessage from 'components/FormErrorMessage'
import useSend from 'hooks/useSend'
import useTerraTxInfo from 'hooks/useTerraTxInfo'

const SubmitButton = (): ReactElement => {
  const [status, setStatus] = useRecoilState(SendProcessStore.sendProcessStatus)

  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)
  const setRequestTxResult = useSetRecoilState(SendProcessStore.requestTxResult)
  const setWaitForReceiptError = useSetRecoilState(
    SendProcessStore.waitForReceiptError
  )

  const [errorMessage, setErrorMessage] = useState('')

  const { submitRequestTx, waitForEtherBaseTransaction } = useSend()
  const { getTxInfos } = useTerraTxInfo()

  const loading = [ProcessStatus.Pending, ProcessStatus.Submit].includes(status)

  const waitForReceipt = async ({
    submitResult,
  }: {
    submitResult: RequestTxResultType
  }): Promise<void> => {
    if (submitResult.success) {
      setStatus(ProcessStatus.Pending)
      if (fromBlockChain === BlockChainType.terra) {
        const waitReceipt = setInterval(async () => {
          try {
            const txInfos = await getTxInfos({
              hash: submitResult.hash,
            })
            if (_.some(txInfos)) {
              setStatus(ProcessStatus.Done)
              clearInterval(waitReceipt)
            }
          } catch (error) {
            setWaitForReceiptError(_.toString(error))
            setStatus(ProcessStatus.Failed)
          }
        }, 500)
      } else {
        try {
          await waitForEtherBaseTransaction({
            hash: submitResult.hash,
          })
          setStatus(ProcessStatus.Done)
        } catch (error) {
          setWaitForReceiptError(_.toString(error))
          setStatus(ProcessStatus.Failed)
        }
      }
    } else {
      setErrorMessage(submitResult.errorMessage || '')
    }
  }

  const onClickSubmitButton = async (): Promise<void> => {
    setErrorMessage('')
    setStatus(ProcessStatus.Submit)

    const submitResult = await submitRequestTx()

    setRequestTxResult(submitResult)

    setStatus(ProcessStatus.Confirm)
    return waitForReceipt({ submitResult })
  }

  const IfLoadingText = (): ReactElement => {
    return loading ? (
      <CircularProgress size={20} style={{ color: COLOR.darkGray2 }} />
    ) : (
      <>Confirm</>
    )
  }

  return (
    <>
      <Button onClick={onClickSubmitButton} disabled={loading}>
        <IfLoadingText />
      </Button>
      <FormErrorMessage
        errorMessage={errorMessage}
        style={{ display: 'block', textAlign: 'center', marginTop: 10 }}
      />
    </>
  )
}

export default SubmitButton
