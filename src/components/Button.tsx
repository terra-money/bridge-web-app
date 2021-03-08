import { COLOR, STYLE } from 'consts'
import { ButtonHTMLAttributes, ReactElement } from 'react'
import styled from 'styled-components'

const StyledContainer = styled.div`
  width: 100%;
`

const StyledDefaultButton = styled.button<ButtonProps>`
  padding: 8px;
  width: 100%;
  background-color: ${COLOR.primary};
  color: ${COLOR.white};
  text-align: center;
  border-radius: ${STYLE.css.borderRadius};
  border-style: none;

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
