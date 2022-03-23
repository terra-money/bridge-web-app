import { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useRecoilValue } from 'recoil'

import warningSvg from 'images/warning.svg'

import { BlockChainType, isAxelarNetwork } from 'types/network'

import SendStore from 'store/SendStore'

import { Text } from 'components'

import FormImage from 'components/FormImage'

const StyledWarningInfo = styled.div`
  display: flex;
  align-items: center;
  border-radius: 4px;
  padding: 16px 20px;
  margin-bottom: 40px;
  background-color: #eca44d22;
  border: 1px solid #eca44d40;
  white-space: pre-wrap;
  font-size: 12px;
`

const StyledWarningInfoText = styled(Text)`
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: #eca44d;
`

const WarningInfo = (): ReactElement => {
  const toBlockChain = useRecoilValue(SendStore.toBlockChain)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)
  const asset = useRecoilValue(SendStore.asset)
  const [infoText, setInfoText] = useState('')

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
    <>
      <StyledWarningInfo>
        <div style={{ paddingRight: 12 }}>
          <FormImage src={warningSvg} size={18} />
        </div>
        <StyledWarningInfoText>{infoText}</StyledWarningInfoText>
      </StyledWarningInfo>
      {isAxelarNetwork(toBlockChain) && (
        <StyledWarningInfo style={{ marginTop: '-20px' }}>
          <div style={{ paddingRight: 12 }}>
            <FormImage src={warningSvg} size={18} />
          </div>
          <StyledWarningInfoText>
            {asset?.symbol} will become Axelar Wrapped {asset?.symbol} after the
            transfer is completed
          </StyledWarningInfoText>
        </StyledWarningInfo>
      )}
    </>
  ) : (
    <></>
  )
}

export default WarningInfo
