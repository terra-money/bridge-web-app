import { COLOR } from 'consts'
import { ButtonHTMLAttributes, ReactElement } from 'react'
import styled from 'styled-components'

const StyledContainer = styled.div`
  width: 100%;
`

const StyledDefaultButton = styled.button<ButtonProps>`
  padding: 8px;
  width: 100%;
  background-color: ${COLOR.orange};
  color: #1e2026;
  text-align: center;
  border-radius: 10px;
  border-style: none;

  cursor: pointer;
  :hover {
    background-color: ${COLOR.lightOrange};
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
