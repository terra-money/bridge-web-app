import { ReactElement } from 'react'
import styled from 'styled-components'
import { COLOR } from 'consts'
import MetamaskImg from '../../../images/metamask.svg'

const StyledButton = styled.button`
  border: 0;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0000;
  color: ${COLOR.white};
  cursor: pointer;
  margin-bottom: 1.3rem;
  margin-top: 0.4rem;
  padding: 0.4rem 0.8rem;
  border-radius: 0.6rem;

  &:hover {
    background-color: ${COLOR.darkGray};
  }
`

const StyledIcon = styled.img`
  width: 20px;
  margin-right: 0.6rem;
`

interface MetamaskTokenProps {
  name: string
  imgUrl: string
  token: string
  decimals: number
}

export default function MetamaskButton({
  name,
  imgUrl,
  token,
  decimals,
}: MetamaskTokenProps): ReactElement {
  return (
    <StyledButton
      onClick={(): void => {
        window.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: token,
              symbol: name,
              decimals,
              image: imgUrl,
            },
          },
        })
      }}
    >
      <StyledIcon src={MetamaskImg} alt="Metamask logo" />
      Add {name} to Metamask
    </StyledButton>
  )
}
