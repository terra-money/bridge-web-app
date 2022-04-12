import { ReactElement } from 'react'
import styled from 'styled-components'

import { STYLE } from 'consts'

import { ExtLink, Text, Row, View, Container } from 'components'

const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  max-width: 640px;
  padding: 28px 0;
  opacity: 0.5;
  @media ${STYLE.media.mobile} {
    width: auto;
    margin-top: 0;
    padding: 24px;
  }
`

const StyledText = styled(Text)`
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.22px;
`

const Footer = (): ReactElement => {
  const community = [
    {
      href: `https://docs.mirror.finance/user-guide/terra-bridge`,
      title: 'DOCS',
    },
    {
      href: `https://discord.gg/EuKCeGFb93`,
      title: 'Discord',
    },
    {
      href: `https://github.com/terra-project/bridge-web-app`,
      title: 'Github',
    },
  ]
  return (
    <StyledContainer>
      <Row
        style={{
          justifyContent: window.innerWidth > 575 ? 'space-between' : 'center',
          flex: 1,
          display: window.innerWidth > 575 ? 'flex' : 'block',
          textAlign: window.innerWidth > 575 ? 'initial' : 'center',
          alignItems: 'center',
          marginTop: -5,
        }}
      >
        <View>
          <StyledText>© Terraform Labs.</StyledText>
        </View>
        <Row
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            marginLeft: -30,
            marginTop: window.innerWidth > 575 ? 0 : 12,
          }}
        >
          {community.map(
            ({ href, title }) =>
              href && (
                <View key={title}>
                  <ExtLink
                    href={href}
                    style={{
                      paddingLeft: window.innerWidth > 575 ? 30 : 30,
                      fontSize: 13,
                      textTransform: 'uppercase',
                    }}
                  >
                    <StyledText>{title}</StyledText>
                  </ExtLink>
                </View>
              )
          )}
        </Row>
      </Row>
    </StyledContainer>
  )
}

export default Footer
