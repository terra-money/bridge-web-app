import { ReactElement } from 'react'
import styled from 'styled-components'
import { useRecoilState } from 'recoil'
import {
  isBrowser,
  isChrome,
  isEdgeChromium,
  isFirefox,
} from 'react-device-detect'

import { NETWORK } from 'consts'

import { Text } from 'components'
import Button from 'components/Button'
import DefaultModal from 'components/Modal'
import ExtLink from 'components/ExtLink'

import SelectWalletStore, {
  SelectWalletModalType,
} from 'store/SelectWalletStore'

const StyledContainer = styled.div`
  padding: 0 30px 30px;
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
        {!(isBrowser && (isChrome || isEdgeChromium || isFirefox)) ? (
          <div style={{ textAlign: 'center' }}>
            <Text style={{ fontSize: 18 }}>
              {'Bridge currently\nonly supports desktop Chrome'}
            </Text>
            <br />
            <ExtLink href={NETWORK.CHROME}>
              <Text
                style={{
                  color: 'inherit',
                  fontSize: 18,
                  marginTop: 10,
                  marginBottom: 30,
                }}
              >
                Download Chrome
              </Text>
            </ExtLink>
          </div>
        ) : (
          <>
            <div>
              <ExtLink
                href={
                  isFirefox
                    ? NETWORK.TERRA_EXTENSION_FIREFOX
                    : NETWORK.TERRA_EXTENSION
                }
              >
                <Text style={{ color: 'inherit', fontSize: 18 }}>
                  Download Station Extension
                </Text>
              </ExtLink>
              <br />
              <Text style={{ fontSize: 18 }}>{'to connect your wallet'}</Text>
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
