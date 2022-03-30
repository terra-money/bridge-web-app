import { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useRecoilValue } from 'recoil'

import warningSvg from 'images/warning.svg'
import infoSvg from 'images/info.svg'

import { BlockChainType, availableBridges } from 'types/network'

import SendStore from 'store/SendStore'

import { Text } from 'components'

import FormImage from 'components/FormImage'

const StyledWarning = styled.div`
  display: flex;
  align-items: center;
  border-radius: 4px;
  padding: 16px 20px;
  margin-bottom: 15px;
  background-color: #eca44d22;
  border: 1px solid #eca44d40;
  white-space: pre-wrap;
  font-size: 12px;
`

const StyledWarningText = styled(Text)`
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: #eca44d;
`

const StyledInfo = styled.div`
  display: flex;
  align-items: center;
  border-radius: 4px;
  padding: 16px 20px;
  margin-bottom: 15px;
  background-color: #727e8b22;
  border: 1px solid #727e8b40;
  white-space: pre-wrap;
  font-size: 12px;
`

const StyledInfoText = styled(Text)`
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: #a3a3a3;
`

const WarningInfo = (): ReactElement => {
  const toBlockChain = useRecoilValue(SendStore.toBlockChain)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)
  const bridgeUsed = useRecoilValue(SendStore.bridgeUsed)
  const asset = useRecoilValue(SendStore.asset)
  const [infoText, setInfoText] = useState('')

  const chain =
    toBlockChain === BlockChainType.terra ? fromBlockChain : toBlockChain
  const bridgesList = availableBridges[chain]

  useEffect(() => {
    if (
      BlockChainType.terra === fromBlockChain &&
      fromBlockChain === toBlockChain
    ) {
      setInfoText(
        'For Terra to Terra transfers, if the Terra address at the receiving end is an exchange address, the transaction will require a “memo”'
      )
    } else if (fromBlockChain !== toBlockChain) {
      setInfoText("Don't use exchange addresses for cross-chain transfers")
    }

    return (): void => {
      setInfoText('')
    }
  }, [toBlockChain, fromBlockChain, asset])

  return infoText ? (
    <div style={{ marginBottom: '40px' }}>
      {bridgesList[0] && bridgesList[0] !== bridgeUsed && (
        <StyledInfo>
          <div style={{ paddingRight: 12 }}>
            <FormImage src={infoSvg} size={18} />
          </div>
          <StyledInfoText>
            The default bridge for this route is {bridgesList[0].toUpperCase()}
          </StyledInfoText>
        </StyledInfo>
      )}

      <StyledWarning>
        <div style={{ paddingRight: 12 }}>
          <FormImage src={warningSvg} size={18} />
        </div>
        <StyledWarningText>{infoText}</StyledWarningText>
      </StyledWarning>
    </div>
  ) : (
    <></>
  )
}

export default WarningInfo
