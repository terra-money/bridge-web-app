import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { useRecoilValue } from 'recoil'
import { Col, Dropdown, Row } from 'react-bootstrap'

import { COLOR, WALLET, UTIL, STYLE } from 'consts'

import { Text } from 'components'

import useAuth from 'hooks/useAuth'
import useSelectWallet from 'hooks/useSelectWallet'

import AuthStore from 'store/AuthStore'
import NetworkStore from 'store/NetworkStore'
import FormImage from 'components/FormImage'

import bridgeLogo from 'images/bridge_logo.png'

const { walletLogo } = WALLET
const StyledContainer = styled.div`
  background-color: ${COLOR.headerBg};
`

const StyledNav = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  min-height: 92px;
  padding: 15px 10px;
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

const Address = styled(Text)`
  overflow: hidden;
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
  border-radius: ${STYLE.css.borderRadius};
  border: solid 1px ${COLOR.terraSky};
  font-size: 12px;
  padding: 8px 12px;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`
const StyledDropdownMenu = styled(Dropdown.Menu)`
  transition-duration: 300ms;
  background-color: ${COLOR.darkGray2};
  border-radius: ${STYLE.css.borderRadius};
  font-size: 12px;
  width: 100%;
  padding: 0;
  text-align: center;
  a {
    color: ${COLOR.white};
    padding: 12px;
    border-radius: ${STYLE.css.borderRadius};
    :hover {
      color: ${COLOR.terraSky};
      background-color: ${COLOR.darkGray2};
    }
  }
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
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle}>
        <StyledLoginUserInfoBox>
          <Row style={{ padding: 0, margin: 0 }}>
            <Col
              style={{
                padding: 0,
                paddingRight: 8,
                alignSelf: 'center',
                paddingTop: 3,
                height: 18,
              }}
            >
              <FormImage src={walletLogo[loginUser.walletType]} size={16} />
            </Col>
            <Col style={{ padding: 0, height: 18 }}>
              <Address>{UTIL.truncate(loginUser.address)}</Address>
            </Col>
          </Row>
          {isTestnet ? (
            <div
              style={{
                borderTop: 'solid 1px #333',
                marginTop: 6,
                paddingTop: 1,
                textAlign: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  color: '#DD794A',
                  fontWeight: 400,
                  marginRight: 4,
                }}
              >
                Connected to
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  color: '#DD794A',
                  fontWeight: 700,
                }}
              >
                TESTNET
              </Text>
            </div>
          ) : (
            <div
              style={{
                borderTop: 'solid 1px #333',
                marginTop: 6,
                paddingTop: 1,
                textAlign: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  color: COLOR.skyGray,
                  fontWeight: 400,
                }}
              >
                Connected
              </Text>
            </div>
          )}
        </StyledLoginUserInfoBox>
      </Dropdown.Toggle>

      <StyledDropdownMenu>
        <Dropdown.Item onClick={logout}>Disconnect</Dropdown.Item>
      </StyledDropdownMenu>
    </Dropdown>
  )
}

const Header = (): ReactElement => {
  const selectWallet = useSelectWallet()
  const isLoggedIn = useRecoilValue(AuthStore.isLoggedIn)

  return (
    <StyledContainer>
      <StyledNav>
        <Row style={{ width: '100%', margin: 0 }}>
          <Col
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              flexDirection: 'column',
              paddingRight: 0,
              paddingLeft: 20,
              flex: 1,
            }}
            sm={10}
            xs={5}
          >
            <StyledLogo>
              <img src={bridgeLogo} alt="" />
            </StyledLogo>
          </Col>
          <Col
            sm={2}
            xs={7}
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              paddingRight: 20,
            }}
          >
            {isLoggedIn ? (
              <LoginUserInfo />
            ) : (
              <StyledConnectWallet onClick={selectWallet.open}>
                Connect Wallet
              </StyledConnectWallet>
            )}
          </Col>
        </Row>
      </StyledNav>
    </StyledContainer>
  )
}

export default Header
