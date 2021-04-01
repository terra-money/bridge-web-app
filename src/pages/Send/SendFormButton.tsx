import { ReactElement, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import _ from 'lodash'

import { COLOR, STYLE } from 'consts'
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
  formScrollView,
}: {
  feeValidationResult: ValidateItemResultType
  formScrollView: React.RefObject<HTMLDivElement>
}): ReactElement => {
  const selectWallet = useSelectWallet()
  const isLoggedIn = useRecoilValue(AuthStore.isLoggedIn)
  const [status, setStatus] = useRecoilState(SendProcessStore.sendProcessStatus)
  const [loading, setloading] = useState(false)

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
    setStatus(ProcessStatus.Confirm)
    formScrollView.current?.scrollTo({ left: 600, behavior: 'smooth' })
  }

  const waitForReceipt = async ({
    submitResult,
  }: {
    submitResult: RequestTxResultType
  }): Promise<void> => {
    if (submitResult.success) {
      setloading(true)
      setStatus(ProcessStatus.Pending)
      if (fromBlockChain === BlockChainType.terra) {
        const waitReceipt = setInterval(async () => {
          try {
            const txInfos = await getTxInfos({
              hash: submitResult.hash,
            })
            if (_.some(txInfos)) {
              setloading(false)
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
          setloading(false)
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
    setloading(true)

    const submitResult = await submitRequestTx()

    setRequestTxResult(submitResult)

    setloading(false)
    waitForReceipt({ submitResult })
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
    <Button
      disabled={false === STYLE.isSupportBrowser}
      onClick={selectWallet.open}
    >
      Connect Wallet
    </Button>
  )
}

export default SendFormButton
