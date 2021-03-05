import { AnchorHTMLAttributes, ReactElement } from 'react'
import styled from 'styled-components'

const StyledA = styled.a`
  padding: 10px;
  color: #4b72e4;
  :hover {
    opacity: 1;
  }
`

export type Props = AnchorHTMLAttributes<HTMLAnchorElement>
const ExtLink = ({ children, ...attrs }: Props): ReactElement => (
  <StyledA {...attrs} target="_blank" rel="noopener noreferrer">
    {children}
  </StyledA>
)

export default ExtLink
