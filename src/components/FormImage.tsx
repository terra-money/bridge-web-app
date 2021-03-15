import { ReactElement } from 'react'
import styled from 'styled-components'

type FormImageProps = {
  src: string
  size: number
}

const StyledFormImage = styled.div<FormImageProps>`
  display: inline-block;
  background-image: url(${(props): string => props.src});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  height: ${(props): number => props.size}px;
  width: ${(props): number => props.size}px;
  margin-top: -2px;
`

const FormImage = (props: FormImageProps): ReactElement => {
  return <StyledFormImage {...props} />
}

export default FormImage
