import { ReactElement, useEffect } from 'react'
import styled from 'styled-components'
import { useRecoilValue } from 'recoil'

import { Text } from 'components'
import SendProcessStore, { ProcessStatus } from 'store/SendProcessStore'
import AuthStore from 'store/AuthStore'

import DefaultModal, { ModalProps } from '../'
import ConfirmStep from './ConfirmStep'
import SubmitStep from './SubmitStep'

const StyledContainer = styled.div`
  padding: 24px;
  max-height: 80vh;
  overflow-x: hidden;
  overflow-y: auto;
`

const SendProcessModal = (modal: ModalProps): ReactElement => {
  const status = useRecoilValue(SendProcessStore.sendProcessStatus)
  const isLoggedIn = useRecoilValue(AuthStore.isLoggedIn)

  useEffect(() => {
    if (isLoggedIn === false) {
      modal.close()
    }
  }, [isLoggedIn])

  return (
    <DefaultModal
      {...modal}
      header={
        <>
          {status === ProcessStatus.Confirm && <Text>Confirm</Text>}
          {(status === ProcessStatus.Submit ||
            status === ProcessStatus.Pending) && (
            <Text>Submit Transaction</Text>
          )}
          {status === ProcessStatus.Done && <Text>Complete</Text>}
        </>
      }
    >
      <StyledContainer>
        {status === ProcessStatus.Confirm ? (
          <ConfirmStep />
        ) : (
          <SubmitStep modal={modal} />
        )}
      </StyledContainer>
    </DefaultModal>
  )
}

export default SendProcessModal
