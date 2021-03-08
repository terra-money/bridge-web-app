import { ReactElement } from 'react'
import styled from 'styled-components'

import { STYLE, COLOR } from 'consts'

import mediumPng from 'images/medium.png'
import discordPng from 'images/discord.png'
import telegramPng from 'images/telegram.png'
import twitterPng from 'images/twitter.png'
import githubPng from 'images/github.png'

import { ExtLink } from 'components'

const StyledContainer = styled.footer`
  padding: 20px;
  background-color: ${COLOR.footerBg};

  @media ${STYLE.media.mobile} {
    min-height: 100px;
  }
`

const Footer = (): ReactElement => {
  const community = [
    {
      href: `https://github.com/terra-project`,
      src: githubPng,
      alt: 'Github',
    },
    {
      href: 'https://medium.com/terra-money',
      src: mediumPng,
      alt: 'Medium',
    },
    {
      href: 'https://t.me/TerraLunaChat',
      src: telegramPng,
      alt: 'Telegram',
    },
    {
      href: 'https://discord.com/invite/bYfyhUT',
      src: discordPng,
      alt: 'Discord',
    },
    {
      href: 'https://twitter.com/terra_money',
      src: twitterPng,
      alt: 'Twitter',
    },
  ]
  return (
    <StyledContainer>
      {community.map(
        ({ href, src, alt }) =>
          href && (
            <ExtLink href={href} key={alt}>
              <img src={src} alt={alt} width={20} height={20} />
            </ExtLink>
          )
      )}
    </StyledContainer>
  )
}

export default Footer
