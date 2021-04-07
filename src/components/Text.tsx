import { HTMLAttributes, ReactElement } from 'react'
import styled from 'styled-components'

import { COLOR } from 'consts'

const StyledText = styled.div`
  display: flex;
  color: ${COLOR.text};
  flex: 1;
`

const Text = (props: HTMLAttributes<HTMLDivElement>): ReactElement => {
  return <StyledText {...props} />
}

export default Text
