import { ReactElement, useCallback, useRef } from 'react'
import styled from 'styled-components'
import { useRecoilState } from 'recoil'
import { InfoCircleFill } from 'react-bootstrap-icons'

import loading from 'images/loading.gif'
import failed from 'images/failed.gif'
import complete from 'images/complete.gif'

import { COLOR, STYLE } from 'consts'

import SendProcessStore, { ProcessStatus } from 'store/SendProcessStore'

import useSendValidate from 'hooks/useSendValidate'

import { Container } from 'components'
import FormTitle from './FormTitle'
import SendForm from './SendForm'
import Confirm from './Confirm'
import Finish from './Finish'
import SendFormButton from './SendFormButton'
import BlockChainNetwork from './BlockChainNetwork'
import FormImage from 'components/FormImage'
import FinishButton from './FinishButton'

const StyledProcessCircle = styled.div`
  height: 128px;
  width: 128px;
  margin: auto;
  border-radius: 100px;
  border: 1px solid #4abcf0;
  box-shadow: 0 2px 4px 0 rgba(15, 15, 24, 0.3),
    0 -1px 4px 0 rgba(119, 232, 255, 0.5);
  align-items: center;
  justify-content: center;
`

const StyledContainer = styled(Container)`
  max-width: 640px;
  padding: 0;
  height: 100%;
  @media (max-width: 575px) {
    padding: 20px 0;
    width: 100vw;
    overflow-x: hidden;
  }
`

const StyledMoblieInfoBox = styled.div`
  margin-bottom: 20px;
  border-radius: 1em;
  padding: 12px;
  border: 1px solid ${COLOR.terraSky};
  color: ${COLOR.terraSky};
  font-size: 12px;
  font-weight: 500;
  @media (max-width: 575px) {
    margin-left: 20px;
    margin-right: 20px;
  }
`

const StyledForm = styled.div`
  background-color: ${COLOR.black};
  padding: 60px;
  border-radius: 1em;
  @media (max-width: 575px) {
    border-radius: 0;
    padding: 20px;
  }
`

const Send = (): ReactElement => {
  const formScrollView = useRef<HTMLDivElement>(null)

  const [status, setStatus] = useRecoilState(SendProcessStore.sendProcessStatus)

  const { validateFee } = useSendValidate()
  const feeValidationResult = validateFee()

  const renderProcessStatus = useCallback((): ReactElement => {
    switch (status) {
      case ProcessStatus.Done:
        return (
          <StyledProcessCircle>
            <FormImage src={complete} />
          </StyledProcessCircle>
        )
      case ProcessStatus.Failed:
        return (
          <StyledProcessCircle
            style={{
              boxShadow:
                '0 2px 4px 0 rgba(254, 99, 99, 0.3), 0 -1px 4px 0 rgba(255, 119, 119, 0.5)',
              border: 'solid 1px #ff5964',
            }}
          >
            <FormImage src={failed} />
          </StyledProcessCircle>
        )
      case ProcessStatus.Pending:
        return (
          <StyledProcessCircle style={{ marginBottom: 60 }}>
            <FormImage
              src={loading}
              size={140}
              style={{ marginLeft: -6, marginTop: -6 }}
            />
          </StyledProcessCircle>
        )
      default:
        return (
          <div style={{ marginBottom: 60 }}>
            <BlockChainNetwork />
          </div>
        )
    }
  }, [status])

  const onClickGoBackToSendInputButton = async (): Promise<void> => {
    setStatus(ProcessStatus.Input)
    formScrollView.current?.scrollTo({ left: 0, behavior: 'smooth' })
  }

  return (
    <StyledContainer>
      {false === STYLE.isSupportBrowser && (
        <StyledMoblieInfoBox>
          <InfoCircleFill style={{ marginRight: 8, marginTop: -2 }} size={14} />
          Bridge only supports desktop Chrome
        </StyledMoblieInfoBox>
      )}

      <StyledForm>
        {/* FormTitle */}
        <FormTitle
          onClickGoBackToSendInputButton={onClickGoBackToSendInputButton}
        />

        {/* Select From, To Blockchain Network */}
        <div style={{ textAlign: 'center' }}>{renderProcessStatus()}</div>

        {[ProcessStatus.Done, ProcessStatus.Failed].includes(status) ? (
          <>
            <Finish />
            <FinishButton formScrollView={formScrollView} />
          </>
        ) : (
          <>
            <div
              ref={formScrollView}
              style={{ display: 'flex', overflowX: 'hidden' }}
            >
              <div style={{ minWidth: '100%' }}>
                <SendForm feeValidationResult={feeValidationResult} />
              </div>
              <div style={{ minWidth: '100%' }}>
                <Confirm />
              </div>
            </div>

            {[ProcessStatus.Input, ProcessStatus.Confirm].includes(status) && (
              <SendFormButton
                formScrollView={formScrollView}
                feeValidationResult={feeValidationResult}
              />
            )}
          </>
        )}
      </StyledForm>
    </StyledContainer>
  )
}

export default Send
