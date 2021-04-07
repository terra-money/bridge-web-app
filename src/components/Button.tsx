import { COLOR } from 'consts'
import { ButtonHTMLAttributes, ReactElement } from 'react'
import styled from 'styled-components'

const StyledContainer = styled.div`
  width: 100%;
`

const StyledDefaultButton = styled.button<ButtonProps>`
  padding: 16px 8px;
  width: 100%;
  background-color: ${COLOR.primary};
  color: ${COLOR.white};
  font-size: 14px;
  text-align: center;
  border-radius: 27px;
  border-style: none;
  box-sizing: border-box;
  user-select: none;
  font-weight: 500;

  cursor: pointer;
  :hover {
    background-color: ${COLOR.primary};
    opacity: 0.8;
  }
  :disabled {
    opacity: 0.3;
    pointer-events: none;
  }
`

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

const Button = (props: ButtonProps): ReactElement => {
  const { ...rest } = props

  return (
    <StyledContainer>
      <StyledDefaultButton type="button" {...rest} />
    </StyledContainer>
  )
}

export default Button
