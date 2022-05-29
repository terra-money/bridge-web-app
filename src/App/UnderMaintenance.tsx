import React, { ReactElement, useState } from 'react'
import styled from 'styled-components'

import maintenancePng from 'images/maintenance.png'

import { COLOR } from 'consts'

import { Text, View } from 'components'

import FormImage from 'components/FormImage'

const StyledBg = styled.div`
  position: fixed;
  z-index: 10;
  top: 0;
  background-color: ${COLOR.darkGray};
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`
const StyledContainer = styled(View)`
  margin: auto;
  align-items: center;
  max-width: 640px;
  padding: 40px;
  border-radius: 2em;
  @media (max-width: 1199px) {
    padding: 40px;
  }
  @media (max-width: 575px) {
    border-radius: 0;
    padding: 20px;
  }
`

const StyledTitle = styled(Text)`
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 16px;
  @media (max-width: 575px) {
    margin-bottom: 8px;
  }
`

const StyledDesc = styled(Text)`
  font-size: 16px;
  margin-bottom: 28px;
  @media (max-width: 575px) {
    margin-bottom: 20px;
  }
`

const StyledEnterAnyway = styled(Text)`
  cursor: pointer;
  color: ${COLOR.primary};
  text-decoration: underline;
  margin-top: 2rem;
`

const StyledClassicButton = styled.a`
  cursor: pointer;
  color: ${COLOR.primary};
  text-decoration: underline;
  cursor: pointer;
  color: ${COLOR.white};
  background-color: ${COLOR.primary};
  text-decoration: none;
  padding: 0.8rem 1.8rem;
  border-radius: 1.5rem;
`

const UnderMaintenance = (): ReactElement => {
  const [hideMaintenance, setHideMaintenance] = useState(false)
  const hide = (): void => setHideMaintenance(true)

  const isUnderMaintenance = false

  if (isUnderMaintenance && false === hideMaintenance) {
    return (
      <StyledBg>
        <StyledContainer>
          <View style={{ marginBottom: 20 }}>
            <FormImage size={80} src={maintenancePng} />
          </View>
          <StyledTitle>Under Maintenance</StyledTitle>
          <StyledDesc>We will be back on Phoenix-1 soon.</StyledDesc>

          <StyledClassicButton href="https://classic-bridge.terra.money">
            Use Bridge Classic
          </StyledClassicButton>
          {window.location.host !== 'bridge.terra.money' && (
            <StyledEnterAnyway onClick={hide}>
              Enter anyway [just for testing]
            </StyledEnterAnyway>
          )}
        </StyledContainer>
      </StyledBg>
    )
  }
  return <View />
}

export default UnderMaintenance
