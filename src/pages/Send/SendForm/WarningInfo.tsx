import { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useRecoilValue } from 'recoil'

import cautionPng from 'images/caution.png'

import { BlockChainType } from 'types/network'

import SendStore from 'store/SendStore'

import { Text } from 'components'

import FormImage from 'components/FormImage'

const StyledWarningInfo = styled.div`
  display: flex;
  border-radius: 4px;
  padding: 16px 20px;
  margin-bottom: 40px;
  background-color: #eda24d26;
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
  color: #cccccc;
`

const WarningInfo = (): ReactElement => {
  const toBlockChain = useRecoilValue(SendStore.toBlockChain)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)
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
  }, [toBlockChain, fromBlockChain])

  return infoText ? (
    <StyledWarningInfo>
      <div style={{ paddingRight: 12 }}>
        <FormImage src={cautionPng} size={16} />
      </div>
      <StyledWarningInfoText>{infoText}</StyledWarningInfoText>
    </StyledWarningInfo>
  ) : (
    <></>
  )
}

export default WarningInfo
