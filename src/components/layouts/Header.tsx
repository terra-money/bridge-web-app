import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { useRecoilValue } from 'recoil'
import { Col, Dropdown, Row } from 'react-bootstrap'

import { COLOR, WALLET, UTIL, STYLE } from 'consts'

import { Text } from 'components'

import useAuth from 'hooks/useAuth'

import AuthStore from 'store/AuthStore'
import NetworkStore from 'store/NetworkStore'
import SendStore from 'store/SendStore'
import FormImage from 'components/FormImage'

import bridgeLogo from 'images/bridge_logo.png'

const { walletLogo } = WALLET
const StyledContainer = styled.div`
  height: 70px;
`

const StyledNav = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 1.5rem;
  background-color: ${COLOR.headerBg};
`

const StyledLogo = styled(Text)`
  font-size: 22px;
`

const Address = styled(Text)`
  overflow: hidden;
`

const StyledLoginUserInfoBox = styled.div`
  border-radius: ${STYLE.css.borderRadius};
  background-color: ${COLOR.darkGray2};
  margin-right: 10px;
  font-size: 14px;
  padding: 0 10px;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`
const StyledDropdownMenu = styled(Dropdown.Menu)`
  transition-duration: 300ms;
  background-color: ${COLOR.darkGray2};
  a {
    color: ${COLOR.white};
    :hover {
      color: ${COLOR.white};
      background-color: ${COLOR.blueGray};
    }
  }
`
const LoginUserInfo = (): ReactElement => {
  const loginUser = useRecoilValue(AuthStore.loginUser)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)

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
          <Row style={{ width: 180, overflow: 'hidden' }}>
            <Col sm={1} style={{ paddingRight: 5, alignSelf: 'center' }}>
              <FormImage src={walletLogo[loginUser.walletType]} size={16} />
            </Col>
            <Col>
              <Address>{UTIL.truncate(loginUser.address)}</Address>
            </Col>
          </Row>
          <div>
            <Text>
              {fromBlockChain === 'bsc' && 'Binance Chain Network'}
              {fromBlockChain === 'ethereum' && 'Ethereum Network'}
              {fromBlockChain === 'terra' && 'Terra Network'}
            </Text>
          </div>
        </StyledLoginUserInfoBox>
      </Dropdown.Toggle>

      <StyledDropdownMenu>
        <Dropdown.Item onClick={logout}>Disconnect</Dropdown.Item>
      </StyledDropdownMenu>
    </Dropdown>
  )
}

const TestnetTitle = (): ReactElement => {
  const isTestnet = useRecoilValue(NetworkStore.isTestnet)

  return (
    <>
      {isTestnet && (
        <Text
          style={{
            borderRadius: 15,
            borderWidth: 2,
            borderColor: COLOR.blueGray,
            borderStyle: 'solid',
            width: 100,
            textAlign: 'center',
            backgroundColor: COLOR.darkGray2,
          }}
        >
          TEST NET
        </Text>
      )}
    </>
  )
}

const Header = (): ReactElement => {
  const isLoggedIn = useRecoilValue(AuthStore.isLoggedIn)

  return (
    <StyledContainer>
      <StyledNav>
        <Row>
          <Col>
            <StyledLogo>
              <img src={bridgeLogo} width={200} height={50} alt="" />
            </StyledLogo>
          </Col>
          <Col style={{ alignSelf: 'center' }}>
            <TestnetTitle />
          </Col>
        </Row>
        <Row>{isLoggedIn && <LoginUserInfo />}</Row>
      </StyledNav>
    </StyledContainer>
  )
}

export default Header
