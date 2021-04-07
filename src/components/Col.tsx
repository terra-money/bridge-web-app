import { ReactElement, HTMLAttributes } from 'react'
import styled from 'styled-components'

const StyledCol = styled.div`
  display: flex;
  flex: 1;
  text-align: left;
  align-items: center;
`

const Col = (props: HTMLAttributes<HTMLDivElement>): ReactElement => {
  return <StyledCol {...props} />
}

export default Col
