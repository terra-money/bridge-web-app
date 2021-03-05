import { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import { CircularProgress } from '@material-ui/core'
import _ from 'lodash'
import { useRecoilState, useRecoilValue } from 'recoil'

import { COLOR, NETWORK, UTIL } from 'consts'

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
  border-radius: 5px;
  margin-bottom: 20px;
`

const SubmitStep = ({ modal }: { modal: ModalProps }): ReactElement => {
  const { submitRequestTx, waitForEtherBaseTransaction } = useSend()
  const { formatBalace, getAssetList } = useAsset()

  // Send Data
  const asset = useRecoilValue(SendStore.asset)
  const amount = useRecoilValue(SendStore.amount)
  const toBlockChain = useRecoilValue(SendStore.toBlockChain)
  const toAddress = useRecoilValue(SendStore.toAddress)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)

  const [status, setStatus] = useRecoilState(SendProcessStore.sendProcessStatus)
  const loginUser = useRecoilValue(AuthStore.loginUser)
  const [requestTxResult, setrequestTxResult] = useState<RequestTxResultType>()
  const [errorMessage, setErrorMessage] = useState('')
  const [sumbitError, setSumbitError] = useState('')
  const { getScannerLink } = useNetwork()
  const { getTxInfos } = useTerraTxInfo()
  const [loading, setloading] = useState(false)

  const onClickSubmitButton = async (): Promise<void> => {
    setErrorMessage('')
    setloading(true)
    const submitResult = await submitRequestTx()

    setloading(false)
    setrequestTxResult(submitResult)

    if (submitResult.success) {
      setloading(true)
      setStatus(ProcessStatus.Pending)

      if (fromBlockChain === BlockChainType.terra) {
        try {
          const waitReceipt = setInterval(async () => {
            const txInfos = await getTxInfos({ hash: submitResult.hash })
            if (_.some(txInfos)) {
              setloading(false)
              setStatus(ProcessStatus.Done)
              getAssetList()
              clearInterval(waitReceipt)
            }
          }, 500)
        } catch (error) {
          setSumbitError(_.toString(error))
        }
      } else {
        try {
          await waitForEtherBaseTransaction({
            hash: submitResult.hash,
          })
        } catch (error) {
          setSumbitError(_.toString(error))
        } finally {
          setloading(false)
          setStatus(ProcessStatus.Done)
          getAssetList()
        }
      }
    } else {
      setErrorMessage(submitResult.errorMessage || '')
    }
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
        {loginUser.walletType === WalletEnum.WalletConnect && (
          <FormErrorMessage
            errorMessage={
              'Please manually close this window after confirming the transaction is sent on your WalletConnect app.'
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

      {status === ProcessStatus.Done ? (
        <Button onClick={modal.close}>Complete</Button>
      ) : (
        <Button disabled={loading} onClick={onClickSubmitButton}>
          {loading ? (
            <CircularProgress size={20} style={{ color: COLOR.darkGray2 }} />
          ) : (
            <>Sumbit transaction via {loginUser.walletType}</>
          )}
        </Button>
      )}

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
