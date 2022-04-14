import { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useRecoilValue } from 'recoil'

import warningSvg from 'images/warning.svg'
import dangerSvg from 'images/danger.svg'
import infoSvg from 'images/info.svg'

import { BlockChainType, availableBridges, BridgeType } from 'types/network'

import SendStore from 'store/SendStore'

import { Text } from 'components'

import FormImage from 'components/FormImage'

const StyledDanger = styled.div`
  display: flex;
  align-items: center;
  border-radius: 4px;
  padding: 16px 20px;
  margin-bottom: 15px;
  background-color: #d64c5518;
  border: 1px solid #d64c5518;
  white-space: pre-wrap;
  font-size: 12px;
`

const StyledDangerText = styled(Text)`
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: #d64c55;
`

const StyledWarning = styled.div`
  display: flex;
  align-items: center;
  border-radius: 4px;
  padding: 16px 20px;
  margin-bottom: 15px;
  background-color: #eca44d18;
  border: 1px solid #eca44d18;
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
  background-color: #727e8b18;
  border: 1px solid #727e8b18;
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
  const [warning, setWarning] = useState('')

  const chain =
    toBlockChain === BlockChainType.terra ? fromBlockChain : toBlockChain
  const bridgesList = availableBridges[chain]

  useEffect(() => {
    if (bridgeUsed === bridgesList[1]) {
      setInfoText('Shuttle is scheduled to be deprecated - use at own risk.')
    } else if (
      BlockChainType.terra === fromBlockChain &&
      fromBlockChain === toBlockChain
    ) {
      setInfoText(
        'For Terra to Terra transfers, if the Terra address at the receiving end is an exchange address, the transaction will require a “memo”'
      )
    } else if (fromBlockChain !== toBlockChain) {
      setInfoText(
        "Don't use exchange addresses for cross-chain transfers. Make sure that the token type is correct before making transfers to the exchanges."
      )
    }

    if (
      BlockChainType.polygon === fromBlockChain &&
      BlockChainType.terra === toBlockChain &&
      bridgeUsed?.toUpperCase() === 'WORMHOLE'
    ) {
      setWarning(
        '512 block confirmation is required for this transfer. It may take more than 15 minutes to receive funds in the destination wallet'
      )
    } else {
      setWarning('')
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

      {warning && (
        <StyledInfo>
          <div style={{ paddingRight: 12 }}>
            <FormImage src={infoSvg} size={18} />
          </div>
          <StyledInfoText>{warning}</StyledInfoText>
        </StyledInfo>
      )}

      <StyledWarning>
        <div style={{ paddingRight: 12 }}>
          <FormImage src={warningSvg} size={18} />
        </div>
        <StyledWarningText>{infoText}</StyledWarningText>
      </StyledWarning>

      {bridgeUsed === BridgeType.wormhole &&
        toBlockChain === BlockChainType.ethereum && (
          <StyledDanger>
            <div style={{ paddingRight: 12 }}>
              <FormImage src={dangerSvg} size={18} />
            </div>
            <StyledDangerText>
              Do not use Wormhole transfer to send funds to exchanges (Coinbase,
              Gemini, etc.)
            </StyledDangerText>
          </StyledDanger>
        )}
    </div>
  ) : (
    <></>
  )
}

export default WarningInfo
