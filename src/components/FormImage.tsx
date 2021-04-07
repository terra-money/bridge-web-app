import { ReactElement } from 'react'
import styled from 'styled-components'

type FormImageProps = {
  src: string
  size?: number
  style?: React.CSSProperties
}

const StyledFormImage = styled.div<FormImageProps>`
  display: inline-block;
  background-image: url(${(props): string => props.src});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  height: ${(props): string => (props.size ? `${props.size}px` : '100%')};
  width: ${(props): string => (props.size ? `${props.size}px` : '100%')};
`

const FormImage = (props: FormImageProps): ReactElement => {
  return <StyledFormImage {...props} />
}

export default FormImage
