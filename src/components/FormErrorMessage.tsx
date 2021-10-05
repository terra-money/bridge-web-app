import { ReactElement } from 'react'
import styled from 'styled-components'
import { COLOR } from 'consts'

import Text from './Text'

const StyledText = styled(Text)`
  color: ${COLOR.red};
  word-break: break-all;
  white-space: pre-wrap;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.28px;
  padding-top: 5px;
  margin-bottom: 8px;
`

const FormErrorMessage = ({
  errorMessage,
  style,
}: {
  errorMessage?: string
  style?: React.CSSProperties
}): ReactElement => {
  return (
    <>{errorMessage && <StyledText style={style}>{errorMessage}</StyledText>}</>
  )
}

export default FormErrorMessage
