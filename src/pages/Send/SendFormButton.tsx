import { ReactElement, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import _ from 'lodash'

import { COLOR } from 'consts'
import { BlockChainType } from 'types/network'
import { RequestTxResultType, ValidateItemResultType } from 'types/send'

import { Button } from 'components'
import useSelectWallet from 'hooks/useSelectWallet'

import AuthStore from 'store/AuthStore'
import SendStore from 'store/SendStore'
import SendProcessStore, { ProcessStatus } from 'store/SendProcessStore'
import FormErrorMessage from 'components/FormErrorMessage'
import useSend from 'hooks/useSend'
import useTerraTxInfo from 'hooks/useTerraTxInfo'
import { CircularProgress } from '@material-ui/core'

const SendFormButton = ({
  feeValidationResult,
}: {
  feeValidationResult: ValidateItemResultType
}): ReactElement => {
  const selectWallet = useSelectWallet()
  const isLoggedIn = useRecoilValue(AuthStore.isLoggedIn)
  const [status, setStatus] = useRecoilState(SendProcessStore.sendProcessStatus)

  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)
  const validationResult = useRecoilValue(SendStore.validationResult)
  const setRequestTxResult = useSetRecoilState(SendProcessStore.requestTxResult)
  const setWaitForReceiptError = useSetRecoilState(
    SendProcessStore.waitForReceiptError
  )

  const [errorMessage, setErrorMessage] = useState('')
  const { submitRequestTx, waitForEtherBaseTransaction } = useSend()
  const { getTxInfos } = useTerraTxInfo()

  const ableButton =
    fromBlockChain === BlockChainType.terra
      ? validationResult.isValid && feeValidationResult.isValid
      : validationResult.isValid

  const onClickSendNextButton = async (): Promise<void> => {
    setErrorMessage('')
    setStatus(ProcessStatus.Confirm)
  }

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

  const NextButton = (): ReactElement => {
    const IfLoadingText = (): ReactElement => {
      return loading ? (
        <CircularProgress size={20} style={{ color: COLOR.darkGray2 }} />
      ) : (
        <>Confirm</>
      )
    }

    return status === ProcessStatus.Input ? (
      <Button onClick={onClickSendNextButton} disabled={!ableButton}>
        Next
      </Button>
    ) : (
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

  return isLoggedIn ? (
    <NextButton />
  ) : (
    <Button onClick={selectWallet.open}>Connect Wallet</Button>
  )
}

export default SendFormButton
