import { ReactElement } from 'react'
import styled from 'styled-components'
import { useRecoilValue } from 'recoil'

import warningSvg from 'images/warning.svg'
import dangerSvg from 'images/danger.svg'
import infoSvg from 'images/info.svg'

import { BlockChainType, availableBridges, BridgeType } from 'types/network'
import SendProcessStore, { ProcessStatus } from 'store/SendProcessStore'

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
  color: #d64c55 !important;
  display: inline;

  span {
    cursor: pointer;
    text-decoration: underline;
  }

  a {
    font-weight: bold;
    color: #d64c55;
    text-decoration: underline;
  }
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
  color: #eca44d !important;
  display: inline;
  a {
    font-weight: bold;
    color: #eca44d;
    text-decoration: underline;
  }
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
  color: #a3a3a3 !important;
  display: inline;
  a {
    font-weight: bold;
    color: #a3a3a3;
    text-decoration: underline;
  }
`

export const DangerElement = ({
  children,
}: {
  children: React.ReactNode
}): ReactElement => {
  return (
    <StyledDanger>
      <div style={{ paddingRight: 12 }}>
        <FormImage src={dangerSvg} size={18} />
      </div>
      <StyledDangerText>{children}</StyledDangerText>
    </StyledDanger>
  )
}

export const WarningElement = ({
  children,
}: {
  children: React.ReactNode
}): ReactElement => {
  return (
    <StyledWarning>
      <div style={{ paddingRight: 12 }}>
        <FormImage src={warningSvg} size={18} />
      </div>
      <StyledWarningText>{children}</StyledWarningText>
    </StyledWarning>
  )
}

export const InfoElement = ({
  style,
  children,
}: {
  style?: React.CSSProperties
  children: React.ReactNode
}): ReactElement => {
  return (
    <StyledInfo style={style}>
      <div style={{ paddingRight: 12 }}>
        <FormImage src={infoSvg} size={18} />
      </div>
      <StyledInfoText>{children}</StyledInfoText>
    </StyledInfo>
  )
}

export const WarningInfo = (): ReactElement => {
  const toBlockChain = useRecoilValue(SendStore.toBlockChain)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)
  const bridgeUsed = useRecoilValue(SendStore.bridgeUsed)
  const status = useRecoilValue(SendProcessStore.sendProcessStatus)

  const chain =
    toBlockChain === BlockChainType.terra ? fromBlockChain : toBlockChain
  const bridgesList = availableBridges[chain]

  function infoText(): string | undefined {
    if (bridgeUsed === BridgeType.ibc) {
      return 'IBC transfers are currently suspended.'
    } else if (bridgeUsed === BridgeType.shuttle) {
      return 'Shuttle transfers from Terra Classic have been disabled.\nIf you own LUNC, UST, or other assets bridged with shuttle on ETH, BSC or Harmony we recommend to them back to Terra Classic.\nThis does NOT affect assetd bridged with Wormhole.'
    } else if (
      BlockChainType.terra === fromBlockChain &&
      fromBlockChain === toBlockChain
    ) {
      return 'For Terra to Terra transfers, if the Terra address at the receiving end is an exchange address, the transaction will require a “memo”'
    } else if (
      BlockChainType.polygon === fromBlockChain &&
      bridgeUsed === BridgeType.wormhole
    ) {
      return '512 block confirmation is required for this transfer. It may take more than 15 minutes to receive funds in the destination wallet'
    } else if (fromBlockChain !== toBlockChain) {
      return "Don't use exchange addresses for cross-chain transfers. Make sure that the token type is correct before making transfers to the exchanges."
    }
  }

  return (
    <div style={{ marginBottom: '40px' }}>
      {status === ProcessStatus.Input && (
        <>
          {bridgesList[0] && bridgesList[0] !== bridgeUsed && (
            <InfoElement>
              The default bridge for this route is{' '}
              {bridgesList[0].toUpperCase()}
            </InfoElement>
          )}

          {infoText() && <WarningElement>{infoText()}</WarningElement>}
        </>
      )}
      {(status === ProcessStatus.Submit ||
        status === ProcessStatus.Confirm ||
        status === ProcessStatus.Done) && (
        <>
          {bridgeUsed === BridgeType.wormhole && (
            <WarningElement>
              Funds are deposited into the destination wallet few minutes after
              transfer. If funds are not received, go{' '}
              <a href="https://portalbridge.com/#/redeem" target="blank">
                to Portal bridge
              </a>{' '}
              to redeem the funds by entering the transaction hash
            </WarningElement>
          )}
        </>
      )}
    </div>
  )
}
