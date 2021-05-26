import { ReactElement } from 'react'
import styled from 'styled-components'
import { COLOR, STYLE } from 'consts'
import { InfoCircle } from 'react-bootstrap-icons'

import Button from 'components/Button'
import { WalletEnum, WalletSupportBrowser, WalletTitle } from 'types/wallet'
import WalletLogo from 'components/WalletLogo'
import { Text } from 'components'

const StyledWalletButton = styled(Button)`
  border-radius: ${STYLE.css.borderRadius};
  padding: 16px;
  margin: 8px 0px;
  border: 1px solid #1e2026;
  transition: all 0.3s ease 0s;
  background: ${COLOR.darkGray};
  color: ${COLOR.white};
  overflow: hidden;

  :hover {
    border-color: ${COLOR.terraSky};
    background: ${COLOR.darkGray};
  }
`

const StyledButtonContents = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const StyledErrorMessage = styled(Text)`
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.28px;
`

const WalletButton = ({
  wallet,
  onClick,
}: {
  wallet: WalletEnum
  onClick: () => void
}): ReactElement => {
  const { isSupport, errorMessage } = WalletSupportBrowser[wallet]
  return (
    <StyledWalletButton disabled={false === isSupport} onClick={onClick}>
      <StyledButtonContents>
        <div style={{ textAlign: 'left' }}>
          <Text>{WalletTitle[wallet]}</Text>
          {false === isSupport && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <InfoCircle style={{ marginRight: 5 }} />
              <StyledErrorMessage>{errorMessage}</StyledErrorMessage>
            </div>
          )}
        </div>
        <WalletLogo walleEnum={wallet} />
      </StyledButtonContents>
    </StyledWalletButton>
  )
}

export default WalletButton
