import { ReactElement, HTMLAttributes } from 'react'
import styled from 'styled-components'

const StyledContainer = styled.div`
  width: 100%;
  margin: auto;
`

const Container = (props: HTMLAttributes<HTMLDivElement>): ReactElement => {
  return <StyledContainer {...props} />
}

export default Container
