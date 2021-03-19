import { ReactElement } from 'react'
import styled from 'styled-components'

import { STYLE, COLOR } from 'consts'

import githubPng from 'images/github.png'

import { ExtLink } from 'components'

const StyledContainer = styled.footer`
  padding: 30px;
  background-color: ${COLOR.black};
  text-align: center;
  opacity: 0.5;
  @media ${STYLE.media.mobile} {
    min-height: 100px;
  }
`

const Footer = (): ReactElement => {
  const community = [
    {
      href: `https://github.com/terra-project/bridge-web-app`,
      src: githubPng,
      alt: 'Github',
    },
  ]
  return (
    <StyledContainer>
      {community.map(
        ({ href, src, alt }) =>
          href && (
            <ExtLink href={href} key={alt}>
              <img src={src} alt={alt} width={24} height={24} />
            </ExtLink>
          )
      )}
    </StyledContainer>
  )
}

export default Footer
