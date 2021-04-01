import { InputHTMLAttributes, ReactElement } from 'react'
import styled from 'styled-components'

import { COLOR, STYLE } from 'consts'

const StyledContainer = styled.div`
  display: flex;
  flex: 1;
`

const StyledInput = styled.input`
  flex: 1;
  padding: 12px 0;
  border: none;
  font-size: 14px;
  border-radius: ${STYLE.css.borderRadius};
  color: ${COLOR.text};
  background-color: ${COLOR.darkGray2};
  :focus {
    outline: none;
  }
`

const FormInput = (
  props: InputHTMLAttributes<HTMLInputElement>
): ReactElement => {
  return (
    <StyledContainer>
      <StyledInput {...props} />
    </StyledContainer>
  )
}

export default FormInput
