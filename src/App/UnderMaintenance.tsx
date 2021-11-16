import React, { ReactElement, useState } from 'react'
import styled from 'styled-components'

import maintenancePng from 'images/maintenance.png'

import { COLOR } from 'consts'

import { Text, View } from 'components'

import useTerraAssets from 'hooks/useTerraAssets'
import { TerraAssetsPathEnum } from 'types'
import { useRecoilValue } from 'recoil'
import NetworkStore from 'store/NetworkStore'
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
  border-radius: 1em;
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
`

const UnderMaintenance = (): ReactElement => {
  const terraLocal = useRecoilValue(NetworkStore.terraLocal)

  const [hideMaintenance, setHideMaintenance] = useState(false)
  const hide = (): void => setHideMaintenance(true)

  const { data: maintenance } = useTerraAssets<{
    mainnet: boolean
    testnet: boolean
  }>({
    path: TerraAssetsPathEnum.station_maintenamce,
  })

  const isUnderMaintenance = maintenance?.[terraLocal.name]

  if (isUnderMaintenance && false === hideMaintenance) {
    return (
      <StyledBg>
        <StyledContainer>
          <View style={{ marginBottom: 20 }}>
            <FormImage size={80} src={maintenancePng} />
          </View>
          <StyledTitle>Under Maintenance</StyledTitle>
          <StyledDesc>We will be back on Columbus-5 soon.</StyledDesc>
          <StyledEnterAnyway onClick={hide}>Enter anyway</StyledEnterAnyway>
        </StyledContainer>
      </StyledBg>
    )
  }
  return <View />
}

export default UnderMaintenance
