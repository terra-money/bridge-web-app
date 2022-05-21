import { ReactElement } from 'react'
import styled from 'styled-components'

const StyledLabel = styled.label<{ color?: string }>`
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.37px;
  color: ${({ color }): string => color || '#737373'};
  font-size: 12px;
  pointer-events: none;
`

const FormLabel = ({
  title,
  color,
}: {
  title: string
  color?: string
}): ReactElement => {
  return <StyledLabel color={color}>{title}</StyledLabel>
}

export default FormLabel
