import { ReactElement, HTMLAttributes } from 'react'
import styled from 'styled-components'

const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`

const Row = (props: HTMLAttributes<HTMLDivElement>): ReactElement => {
  return <StyledRow {...props} />
}

export default Row
