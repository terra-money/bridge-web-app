import React, { ReactElement, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { useRecoilValue } from 'recoil'
import { isBrowser, isMobile } from 'react-device-detect'
import ClickAwayListener from 'react-click-away-listener'

import { COLOR, UTIL, STYLE } from 'consts'

import { Container, Text, View, Row } from 'components'

import useAuth from 'hooks/useAuth'
import useSelectWallet from 'hooks/useSelectWallet'

import AuthStore from 'store/AuthStore'
import NetworkStore from 'store/NetworkStore'

import bridgeLogo from 'images/bridge_logo.png'
import testnetLabel from 'images/testnet_label.png'
import WalletLogo from 'components/WalletLogo'
import FormImage from 'components/FormImage'
import SendStore from 'store/SendStore'
import { BlockChainType } from 'types'

const StyledContainer = styled(Container)`
  position: relative;
`
const StyledNavContainer = styled(Container)`
  max-width: 640px;
`

const StyledNav = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 47px;
  padding-bottom: 19px;
  @media ${STYLE.media.mobile} {
    padding: 20px 24px;
  }
`

const StyledLogo = styled(Text)`
  font-size: 0;
  img {
    width: 120px;
    height: 30px;
  }
  @media ${STYLE.media.mobile} {
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

const StyledConnectWallet = styled(View)`
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
const StyledLoginUserInfoBox = styled(Row)`
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

const StyledDropdown = styled(View)`
  position: relative;
`

const dropdownKeyframes = keyframes`
  0% {
    opacity: 0;
    margin-bottom: 0;
  }
  
  100% {
    margin-bottom: -40px;
    opacity: 1;
  }
`

const StyledDropdownMenu = styled(View)`
  position: absolute;
  cursor: pointer;
  bottom: 0;
  height: 40px;
  margin-bottom: -40px;
  justify-content: center;
  animation: ${dropdownKeyframes} 0.3s ease;
  background-color: #484848;
  border-radius: ${STYLE.css.borderRadius};
  width: 100%;
  padding: 0;
  text-align: center;
  :hover {
    opacity: 0.8;
  }
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

const StyledTestnetLabel = styled(View)`
  position: absolute;
  top: 0;
  right: 0;
`

const LoginUserInfo = (): ReactElement => {
  const isTestnet = useRecoilValue(NetworkStore.isTestnet)
  const terraLocal = useRecoilValue(NetworkStore.terraLocal)
  const loginUser = useRecoilValue(AuthStore.loginUser)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)
  const etherBaseExt = useRecoilValue(NetworkStore.etherBaseExt)
  const [isOpen, setIsOpen] = useState(false)

  const { logout } = useAuth()

  return (
    <ClickAwayListener
      onClickAway={(): void => {
        setIsOpen(false)
      }}
    >
      <StyledDropdown>
        <StyledLoginUserInfoBox onClick={(): void => setIsOpen(!isOpen)}>
          <WalletLogo
            style={{ marginRight: 5 }}
            walleEnum={loginUser.walletType}
            size={16}
          />
          <StyledAddress>{UTIL.truncate(loginUser.address)}</StyledAddress>

          {isBrowser && (
            <>
              <View
                style={{
                  display: 'inline-block',
                  width: 1,
                  height: 14,
                  backgroundColor: 'white',
                  opacity: 0.4,
                  margin: '0 8px',
                }}
              />
              <View
                style={{
                  display: 'inline-block',
                  textAlign: 'center',
                }}
              >
                {isTestnet ? (
                  <>
                    <StyledConnectedText style={{ color: '#DD794A' }}>
                      {fromBlockChain === BlockChainType.terra
                        ? `Connected to ${terraLocal.name.toUpperCase()}`
                        : `Connected to ${
                            etherBaseExt?.name.toUpperCase() || 'TESTNET'
                          }`}
                    </StyledConnectedText>
                  </>
                ) : (
                  <StyledConnectedText>Connected</StyledConnectedText>
                )}
              </View>
            </>
          )}
        </StyledLoginUserInfoBox>

        {isOpen && (
          <StyledDropdownMenu>
            <View onClick={logout}>Disconnect</View>
          </StyledDropdownMenu>
        )}
      </StyledDropdown>
    </ClickAwayListener>
  )
}

const Header = (): ReactElement => {
  const selectWallet = useSelectWallet()
  const isLoggedIn = useRecoilValue(AuthStore.isLoggedIn)
  const isTestnet = useRecoilValue(NetworkStore.isTestnet)

  return (
    <StyledContainer>
      <StyledNavContainer>
        <StyledNav>
          <StyledLogo>
            <img src={bridgeLogo} alt="" />
          </StyledLogo>
          {isLoggedIn ? (
            <LoginUserInfo />
          ) : (
            <View>
              <StyledConnectWallet onClick={selectWallet.open}>
                Connect Wallet
              </StyledConnectWallet>
            </View>
          )}
        </StyledNav>
      </StyledNavContainer>

      {isMobile && isTestnet && (
        <StyledTestnetLabel>
          <FormImage src={testnetLabel} style={{ width: 60, height: 60 }} />
        </StyledTestnetLabel>
      )}
    </StyledContainer>
  )
}

export default Header
