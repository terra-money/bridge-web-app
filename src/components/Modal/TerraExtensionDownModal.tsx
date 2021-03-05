import { ReactElement } from 'react'
import styled from 'styled-components'
import { Link } from 'react-bootstrap-icons'

import { NETWORK } from 'consts'
import { Text } from 'components'
import DefaultModal, { ModalProps } from 'components/Modal'

import ExtLink from '../ExtLink'
import Button from 'components/Button'

const StyledContainer = styled.div`
  padding: 0 10px 10px 10px;
`

const TerraExtensionDownModal = (modal: ModalProps): ReactElement => {
  const handleInstalled = (): void => {
    window.location.reload()
  }

  return (
    <DefaultModal {...modal}>
      <StyledContainer>
        {!navigator.userAgent.includes('Chrome') ? (
          <div>
            <Text>{'Mirror currently\nonly supports Chrome'}</Text>
            <br />
            <ExtLink href={NETWORK.CHROME}>
              <span style={{ paddingRight: 10 }}>
                <Link />
              </span>
              <Text style={{ color: 'inherit' }}>Download Chrome</Text>
            </ExtLink>
          </div>
        ) : (
          <>
            <div>
              <Text>
                {'Download Terra Station Extension\nto connect your wallet'}
              </Text>
              <br />
              <ExtLink href={NETWORK.TERRA_EXTENSION}>
                <span style={{ paddingRight: 10 }}>
                  <Link />
                </span>
                <Text style={{ color: 'inherit' }}>
                  Download Terra Station Extension
                </Text>
              </ExtLink>
            </div>
            <br />
            <Button onClick={handleInstalled}>I installed it.</Button>
          </>
        )}
      </StyledContainer>
    </DefaultModal>
  )
}

export default TerraExtensionDownModal
