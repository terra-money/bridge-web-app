import { InputHTMLAttributes, LabelHTMLAttributes, ReactElement } from 'react'
import styled from 'styled-components'

import { COLOR } from 'consts'

const StyledContainer = styled.div`
  position: relative;
  display: flex;
  flex: 1;
`

const StyledInput = styled.input`
  flex: 1;
  padding-top: 12px;
  padding-bottom: 6px;
  border: none;
  border-radius: 0;
  padding-left: 0;
  font-size: 16px;
  color: ${COLOR.text};
  border-bottom: 1px solid ${COLOR.darkGray2};
  background-color: transparent;
  :focus {
    outline: none;
  }

  :focus ~ label,
  :not(:placeholder-shown) ~ label {
    top: -15px;
    font-size: 12px;
    letter-spacing: -0.28px;
  }
`

const StyledLable = styled.label`
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.37px;
  color: #a3a3a3;
  font-size: 16px;
  position: absolute;
  pointer-events: none;
  top: 10px;
  transition: 0.2s ease all;
  -moz-transition: 0.2s ease all;
  -webkit-transition: 0.2s ease all;
`

const FormLabelInput = ({
  inputProps,
  labelProps,
}: {
  inputProps: InputHTMLAttributes<HTMLInputElement>
  labelProps: LabelHTMLAttributes<HTMLLabelElement>
}): ReactElement => {
  return (
    <StyledContainer>
      <StyledInput
        {...inputProps}
        // Placeholder ' ' used to distinguish of label position
        placeholder=" "
        onWheel={({ currentTarget }): void => {
          currentTarget.blur()
        }}
      />
      <StyledLable {...labelProps} />
    </StyledContainer>
  )
}

export default FormLabelInput
