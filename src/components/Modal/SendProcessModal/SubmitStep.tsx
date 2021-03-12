import { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import { CircularProgress } from '@material-ui/core'
import _ from 'lodash'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { COLOR, NETWORK, UTIL, STYLE } from 'consts'

import AuthStore from 'store/AuthStore'
import SendStore from 'store/SendStore'
import SendProcessStore, { ProcessStatus } from 'store/SendProcessStore'

import { Text } from 'components'
import Button from 'components/Button'
import FormErrorMessage from 'components/FormErrorMessage'
import FormImage from 'components/FormImage'
import ExtLink from 'components/ExtLink'

import { RequestTxResultType } from 'types/send'
import { WalletEnum } from 'types/wallet'
import { BlockChainType } from 'types/network'

import useAsset from 'hooks/useAsset'
import useSend from 'hooks/useSend'
import useNetwork from 'hooks/useNetwork'
import useTerraTxInfo from 'hooks/useTerraTxInfo'

import { ModalProps } from '..'

const StyledContainer = styled.div`
  padding: 0;
`

const StyledInfoText = styled(Text)`
  white-space: pre-wrap;
  text-align: center;
  display: block;
  margin-bottom: 10px;
`

const StyledToAddress = styled.div`
  padding: 20px;
  border: 1px solid ${COLOR.skyGray};
  border-radius: ${STYLE.css.borderRadius};
  margin-bottom: 20px;
`

const TxLink = ({
  requestTxResult,
}: {
  requestTxResult?: RequestTxResultType
}): ReactElement => {
  const { getScannerLink } = useNetwork()
  return (
    <>
      {requestTxResult?.success && (
        <div style={{ marginBottom: 20 }}>
          <ExtLink
            href={getScannerLink({
              address: requestTxResult.hash,
              type: 'tx',
            })}
          >
            TX : {UTIL.truncate(requestTxResult.hash, [15, 15])}
          </ExtLink>
        </div>
      )}
    </>
  )
}

const SubmitButton = ({
  modal,
  loading,
  onClickSubmitButton,
}: {
  modal: ModalProps
  loading: boolean
  onClickSubmitButton: () => Promise<void>
}): ReactElement => {
  const status = useRecoilValue(SendProcessStore.sendProcessStatus)

  const loginUser = useRecoilValue(AuthStore.loginUser)

  const SubmitButtonText = (): ReactElement => {
    return loading ? (
      <CircularProgress size={20} style={{ color: COLOR.darkGray2 }} />
    ) : (
      <>Sumbit transaction via {loginUser.walletType}</>
    )
  }

  return status === ProcessStatus.Done ? (
    <Button onClick={modal.close}>Complete</Button>
  ) : (
    <Button disabled={loading} onClick={onClickSubmitButton}>
      <SubmitButtonText />
    </Button>
  )
}

const SubmitStep = ({ modal }: { modal: ModalProps }): ReactElement => {
  const { submitRequestTx, waitForEtherBaseTransaction } = useSend()
  const { formatBalace } = useAsset()

  // Send Data
  const asset = useRecoilValue(SendStore.asset)
  const amount = useRecoilValue(SendStore.amount)
  const toBlockChain = useRecoilValue(SendStore.toBlockChain)
  const toAddress = useRecoilValue(SendStore.toAddress)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)

  const setStatus = useSetRecoilState(SendProcessStore.sendProcessStatus)
  const loginUser = useRecoilValue(AuthStore.loginUser)
  const [requestTxResult, setrequestTxResult] = useState<RequestTxResultType>()
  const [errorMessage, setErrorMessage] = useState('')
  const [sumbitError, setSumbitError] = useState('')
  const { getTxInfos } = useTerraTxInfo()
  const [loading, setloading] = useState(false)

  const waitForReceipt = async (
    submitResult: RequestTxResultType
  ): Promise<void> => {
    if (submitResult.success) {
      setloading(true)
      setStatus(ProcessStatus.Pending)

      try {
        if (fromBlockChain === BlockChainType.terra) {
          const waitReceipt = setInterval(async () => {
            const txInfos = await getTxInfos({ hash: submitResult.hash })
            if (_.some(txInfos)) {
              setloading(false)
              setStatus(ProcessStatus.Done)
              clearInterval(waitReceipt)
            }
          }, 500)
        } else {
          await waitForEtherBaseTransaction({
            hash: submitResult.hash,
          })
          setloading(false)
          setStatus(ProcessStatus.Done)
        }
      } catch (error) {
        setSumbitError(_.toString(error))
        setloading(false)
        setStatus(ProcessStatus.Done)
      }
    } else {
      setErrorMessage(submitResult.errorMessage || '')
    }
  }

  const onClickSubmitButton = async (): Promise<void> => {
    setErrorMessage('')
    setloading(true)
    const submitResult = await submitRequestTx()

    setloading(false)
    setrequestTxResult(submitResult)

    waitForReceipt(submitResult)
  }

  // try confirm immediately
  useEffect(() => {
    onClickSubmitButton()
  }, [])

  return (
    <StyledContainer>
      <div>
        <StyledInfoText>
          {`Transferring ${asset?.symbol} from ${NETWORK.blockChainName[fromBlockChain]} Network to ${NETWORK.blockChainName[toBlockChain]} Network.\nTransaction will be submitted via ${loginUser.walletType}`}
        </StyledInfoText>
        {loginUser.walletType === WalletEnum.WalletConnect && loading && (
          <FormErrorMessage
            style={{
              whiteSpace: 'pre-wrap',
              textAlign: 'center',
              display: 'block',
            }}
            errorMessage={
              'If loading takes too long after sending transaction on your WalletConnect, \nplease check if your application is up to date.'
            }
          />
        )}
        <div style={{ textAlign: 'center' }}>
          <div>
            <Text
              style={{ fontSize: 16, color: COLOR.skyGray, marginBottom: 5 }}
            >
              Amount
            </Text>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}
          >
            <FormImage src={asset?.loguURI || ''} size={30} />
            <Text style={{ fontSize: 30, paddingLeft: 10 }}>
              {formatBalace(amount)} {asset?.symbol}
            </Text>
          </div>
        </div>
      </div>

      <StyledToAddress>
        <div>
          <Text style={{ fontSize: 16, color: COLOR.skyGray, marginBottom: 5 }}>
            To Address
          </Text>
        </div>
        <Text>{toAddress}</Text>
      </StyledToAddress>

      <TxLink requestTxResult={requestTxResult} />

      <SubmitButton
        modal={modal}
        loading={loading}
        onClickSubmitButton={onClickSubmitButton}
      />

      <FormErrorMessage errorMessage={errorMessage} />
      {sumbitError && (
        <div>
          <div>
            <Text>ERROR FROM NETWORK : </Text>
          </div>
          <FormErrorMessage errorMessage={sumbitError} />
        </div>
      )}
    </StyledContainer>
  )
}

export default SubmitStep
