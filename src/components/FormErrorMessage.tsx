import { ReactElement } from 'react'
import { Text } from 'components'
import styled from 'styled-components'

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
