import { ReactElement } from 'react'
import styled from 'styled-components'
import { useRecoilValue } from 'recoil'

import { Text } from 'components'
import SendProcessStore, { ProcessStatus } from 'store/SendProcessStore'
import FormImage from 'components/FormImage'
import btn_back from 'images/btn_back.png'

const StyledContainer = styled.div`
  display: flex;
`

const StyledFormTitle = styled(Text)`
  margin-bottom: 42px;
  width: 100%;
  height: 24px;
  font-size: 20px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.31px;
  justify-content: center;
  color: #ffffff;
`

const FormTitleText: Record<ProcessStatus, string> = {
  [ProcessStatus.Input]: 'Send',
  [ProcessStatus.Confirm]: 'Confirm',
  [ProcessStatus.Submit]: 'Confirm',
  [ProcessStatus.Pending]: 'Confirm',
  [ProcessStatus.Done]: 'Complete',
  [ProcessStatus.Failed]: 'Failed',
}

const FormTitle = ({
  onClickGoBackToSendInputButton,
}: {
  onClickGoBackToSendInputButton: () => void
}): ReactElement => {
  const status = useRecoilValue(SendProcessStore.sendProcessStatus)
  const GoBackButton = (): ReactElement => {
    return (
      <div
        style={{ position: 'absolute', cursor: 'pointer' }}
        onClick={onClickGoBackToSendInputButton}
      >
        <FormImage src={btn_back} size={18} />
      </div>
    )
  }
  return (
    <StyledContainer>
      {status === ProcessStatus.Confirm && <GoBackButton />}
      <StyledFormTitle>{FormTitleText[status]}</StyledFormTitle>
    </StyledContainer>
  )
}

export default FormTitle
