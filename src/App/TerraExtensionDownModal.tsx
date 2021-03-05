import { ReactElement } from 'react'
import styled from 'styled-components'
import { Link } from 'react-bootstrap-icons'
import { useRecoilState } from 'recoil'

import { NETWORK } from 'consts'

import { Text } from 'components'
import Button from 'components/Button'
import DefaultModal from 'components/Modal'
import ExtLink from 'components/ExtLink'

import SelectWalletStore, {
  SelectWalletModalType,
} from 'store/SelectWalletStore'

const StyledContainer = styled.div`
  padding: 0 10px 10px 10px;
`

const TerraExtensionDownModal = (): ReactElement => {
  const handleInstalled = (): void => {
    window.location.reload()
  }

  const [isVisibleModalType, setIsVisibleModalType] = useRecoilState(
    SelectWalletStore.isVisibleModalType
  )
  return (
    <DefaultModal
      {...{
        isOpen: isVisibleModalType === SelectWalletModalType.terraExtInstall,
        close: (): void => {
          setIsVisibleModalType(undefined)
        },
      }}
    >
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
