import { ReactElement } from 'react'
import styled from 'styled-components'

import Text from './Text'

const StyledText = styled(Text)`
  color: red;
  word-break: break-all;
`

const FormErrorMessage = ({
  errorMessage,
}: {
  errorMessage?: string
}): ReactElement => {
  return <>{errorMessage && <StyledText>{errorMessage}</StyledText>}</>
}

export default FormErrorMessage
