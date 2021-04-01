import { ReactElement } from 'react'
import styled from 'styled-components'
import { useRecoilValue } from 'recoil'
import { ChevronLeft } from 'react-bootstrap-icons'

import { Text } from 'components'
import SendProcessStore, { ProcessStatus } from 'store/SendProcessStore'

const StyledContainer = styled.div`
  display: flex;
`

const StyledFormTitle = styled(Text)`
  margin-bottom: 42px;
  width: 100%;
  height: 24px;
  font-family: Gotham;
  font-size: 20px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.31px;
  text-align: center;
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
      <ChevronLeft cursor="pointer" onClick={onClickGoBackToSendInputButton} />
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
