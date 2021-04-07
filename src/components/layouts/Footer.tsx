import { ReactElement } from 'react'
import styled from 'styled-components'

import { STYLE } from 'consts'

import { ExtLink, Text, Container, Row, Col } from 'components'

const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  max-width: 640px;
  margin-top: 28px;
  margin-bottom: 28px;
  opacity: 0.5;
  @media ${STYLE.media.mobile} {
    min-height: 100px;
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
      href: `https://github.com/terra-project/bridge-web-app`,
      title: 'Github',
    },
  ]
  return (
    <StyledContainer>
      <Row>
        <Col>
          <StyledText>© Terraform Labs.</StyledText>
        </Col>
        {community.map(
          ({ href, title }) =>
            href && (
              <Col key={title} style={{ flex: '0 0 8%' }}>
                <ExtLink
                  href={href}
                  style={{
                    paddingLeft: 15,
                    paddingRight: 15,
                    fontSize: 13,
                    textTransform: 'uppercase',
                  }}
                >
                  <StyledText>{title}</StyledText>
                </ExtLink>
              </Col>
            )
        )}
      </Row>
    </StyledContainer>
  )
}

export default Footer
