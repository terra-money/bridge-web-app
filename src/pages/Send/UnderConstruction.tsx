import { ReactElement } from 'react'
import styled from 'styled-components'
import { Container } from 'react-bootstrap'

import Text from 'components/Text'
import ExtLink from 'components/ExtLink'

const StyledContainer = styled(Container)`
  padding: 40px 0;
  height: 100%;
  @media (max-width: 575px) {
    padding: 20px 0;
    width: 100vw;
    overflow-x: hidden;
  }
`

const StyledTitle = styled(Text)`
  font-weight: bold;
  display: block;
`

const StyledText = styled(Text)`
  display: block;
`

const UnderConstruction = (): ReactElement => {
  return (
    <StyledContainer>
      <div>
        <StyledTitle>Under Construction</StyledTitle>
      </div>
      <StyledText>Terra Bridge will be open soon</StyledText>
      <br />
      <StyledText>
        To transfer assets to different blockchain networks, please use the
        below services until Terra Bridge is officially announced.
      </StyledText>
      <br />
      <br />
      <div>
        <StyledTitle>{'Terra → ETH & BSC'}</StyledTitle>
      </div>
      <ExtLink href={'https://terra.mirror.finance/send'}>
        https://terra.mirror.finance/send
      </ExtLink>
      <div>
        <StyledTitle>{'Ethereum → Terra'}</StyledTitle>
      </div>
      <ExtLink href={'https://eth.mirror.finance/my'}>
        https://eth.mirror.finance/my
      </ExtLink>
      <div>
        <StyledTitle>{'BSC → Terra'}</StyledTitle>
      </div>
      <ExtLink href={'https://bsc.mirror.finance'}>
        https://bsc.mirror.finance
      </ExtLink>
    </StyledContainer>
  )
}

export default UnderConstruction
