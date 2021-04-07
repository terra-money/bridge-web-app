import { ReactElement } from 'react'
import styled from 'styled-components'

const StyledLable = styled.label`
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.37px;
  color: #a3a3a3;
  font-size: 12px;
  pointer-events: none;
`

const FormLabel = ({ title }: { title: string }): ReactElement => {
  return <StyledLable>{title}</StyledLable>
}

export default FormLabel
