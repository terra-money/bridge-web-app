import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { useRecoilValue } from 'recoil'
import { Dropdown } from 'react-bootstrap'

import { COLOR, WALLET, UTIL, STYLE } from 'consts'

import { Container, Text } from 'components'

import useAuth from 'hooks/useAuth'
import useSelectWallet from 'hooks/useSelectWallet'

import AuthStore from 'store/AuthStore'
import NetworkStore from 'store/NetworkStore'
import FormImage from 'components/FormImage'

import bridgeLogo from 'images/bridge_logo.png'

const { walletLogo } = WALLET
const StyledContainer = styled(Container)`
  max-width: 640px;
`

const StyledNav = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 47px;
  padding-bottom: 19px;
  @media (max-width: 767px) {
    padding: 15px 0;
  }
`

const StyledLogo = styled(Text)`
  font-size: 0;
  img {
    width: 120px;
    height: 30px;
  }
  @media (max-width: 575px) {
    img {
      width: 104px;
      height: 26px;
    }
  }
`

const StyledAddress = styled(Text)`
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.19px;
`

const StyledConnectWallet = styled.div`
  border-radius: 30px;
  background-color: ${COLOR.primary};
  font-size: 13px;
  padding: 8px 16px;
  cursor: pointer;
  white-space: nowrap;
  :hover {
    opacity: 0.8;
  }
`
const StyledLoginUserInfoBox = styled.div`
  display: flex;
  align-items: center;
  border-radius: ${STYLE.css.borderRadius};
  border: solid 1px ${COLOR.terraSky};
  font-size: 12px;
  padding: 8px 12px;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`

const StyledDropdown = styled(Dropdown)`
  position: relative;
`

const StyledDropdownMenu = styled(Dropdown.Menu)`
  transition-duration: 300ms;
  background-color: #484848;
  border-radius: ${STYLE.css.borderRadius};
  width: 100%;
  padding: 0;
  text-align: center;
  a {
    display: block;
    color: ${COLOR.white};
    padding: 12px;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: -0.25px;
    border-radius: ${STYLE.css.borderRadius};
    text-decoration: none;
    :hover {
      color: ${COLOR.white};
      background-color: rgba(85, 146, 247, 0.1);
    }
  }
`

const StyledConnectedText = styled(Text)`
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.19px;
  color: ${COLOR.terraSky};
`

const LoginUserInfo = (): ReactElement => {
  const isTestnet = useRecoilValue(NetworkStore.isTestnet)
  const loginUser = useRecoilValue(AuthStore.loginUser)

  const { logout } = useAuth()
  const CustomToggle = React.forwardRef((props: any, ref: any) => {
    const { children, onClick } = props
    return (
      <span
        ref={ref}
        onClick={(e): void => {
          e.preventDefault()
          onClick(e)
        }}
      >
        {children}
      </span>
    )
  })
  return (
    <StyledDropdown>
      <Dropdown.Toggle as={CustomToggle}>
        <StyledLoginUserInfoBox>
          <FormImage
            style={{ marginRight: 5 }}
            src={walletLogo[loginUser.walletType]}
            size={16}
          />
          <StyledAddress>{UTIL.truncate(loginUser.address)}</StyledAddress>
          <div
            style={{
              display: 'inline-block',
              width: 1,
              height: 14,
              backgroundColor: 'white',
              opacity: 0.4,
              margin: '0 8px',
            }}
          />
          <div
            style={{
              display: 'inline-block',
              textAlign: 'center',
            }}
          >
            {isTestnet ? (
              <>
                <StyledConnectedText style={{ color: '#DD794A' }}>
                  Connected to TESTNET
                </StyledConnectedText>
              </>
            ) : (
              <StyledConnectedText>Connected</StyledConnectedText>
            )}
          </div>
        </StyledLoginUserInfoBox>
      </Dropdown.Toggle>

      <StyledDropdownMenu>
        <Dropdown.Item onClick={logout}>Disconnect</Dropdown.Item>
      </StyledDropdownMenu>
    </StyledDropdown>
  )
}

const Header = (): ReactElement => {
  const selectWallet = useSelectWallet()
  const isLoggedIn = useRecoilValue(AuthStore.isLoggedIn)

  return (
    <StyledContainer>
      <StyledNav>
        <StyledLogo>
          <img src={bridgeLogo} alt="" />
        </StyledLogo>
        {isLoggedIn ? (
          <LoginUserInfo />
        ) : (
          STYLE.isSupportBrowser && (
            <div>
              <StyledConnectWallet onClick={selectWallet.open}>
                Connect Wallet
              </StyledConnectWallet>
            </div>
          )
        )}
      </StyledNav>
    </StyledContainer>
  )
}

export default Header
