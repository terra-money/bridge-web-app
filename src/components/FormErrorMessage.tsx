import { ReactElement, CSSProperties } from 'react'
import styled from 'styled-components'

import Text from './Text'

const StyledText = styled(Text)`
  color: red;
  word-break: break-all;
  font-size: 13px;
  text-align: right;
  display: block;
  padding-bottom: 10px;
`

const FormErrorMessage = ({
  errorMessage,
  style,
}: {
  errorMessage?: string
  style?: CSSProperties
}): ReactElement => {
  return (
    <>{errorMessage && <StyledText style={style}>{errorMessage}</StyledText>}</>
  )
}

export default FormErrorMessage
