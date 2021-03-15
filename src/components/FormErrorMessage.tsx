import { ReactElement, CSSProperties } from 'react'
import styled from 'styled-components'
import { COLOR } from 'consts'

import Text from './Text'

const StyledText = styled(Text)`
  color: ${COLOR.red};
  word-break: break-all;
  font-size: 13px;
  padding-top: 5px;
  margin-bottom: 8px;
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
