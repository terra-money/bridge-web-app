import { ReactElement, useState } from 'react'
import styled from 'styled-components'
import { useRecoilState, useRecoilValue } from 'recoil'

import { Text, View } from 'components'
import SendProcessStore, { ProcessStatus } from 'store/SendProcessStore'
import FormImage from 'components/FormImage'
import btn_back from 'images/btn_back.png'
import { COLOR } from 'consts'
import SendStore from 'store/SendStore'
import { BridgeType } from 'types'

const StyledContainer = styled(View)`
  position: relative;
  align-items: center;
`

const StyledFormTitle = styled(Text)`
  margin-bottom: 42px;
  height: 24px;
  font-size: 20px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.31px;
  justify-content: center;
  color: #ffffff;
`

const StyledSwitchButton = styled.div`
  background: ${COLOR.darkGray3};
  border-radius: 25px;
  overflow: hidden;
  width: 180px;
  height: 50px;
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  color: ${COLOR.white};
  position: relative;
  margin-top: -30px;
  margin-bottom: 20px;
`

const StyledSwitchSelector = styled.div`
  background: ${COLOR.darkGray};
  border-radius: 30px;
  overflow: hidden;
  width: calc(50% - 8px);
  height: calc(100% - 8px);
  position: absolute;
  border: 4px solid ${COLOR.darkGray3};
`

const StyledSwitchCheckbox = styled.div`
  input {
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  :before {
    content: 'Bridge';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
    pointer-events: none;
  }

  :after {
    content: 'Swap';
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
    pointer-events: none;
  }
`

const FormTitleText: Record<ProcessStatus, string> = {
  [ProcessStatus.Input]: 'Bridge',
  [ProcessStatus.Confirm]: 'Confirm',
  [ProcessStatus.Submit]: 'Confirm',
  [ProcessStatus.Pending]: 'Confirm',
  [ProcessStatus.Done]: 'Complete',
  [ProcessStatus.Failed]: 'Failed',
}

const FormTitle = ({
  onClickGoBackToSendInputButton,
}: {
  onClickGoBackToSendInputButton: () => void
}): ReactElement => {
  const status = useRecoilValue(SendProcessStore.sendProcessStatus)
  const [bridgeUsed] = useRecoilState(SendStore.bridgeUsed)
  const [checked, setChecked] = useState(bridgeUsed === BridgeType.thorswap)

  const GoBackButton = (): ReactElement => {
    return (
      <View
        style={{ position: 'absolute', cursor: 'pointer', left: 0 }}
        onClick={onClickGoBackToSendInputButton}
      >
        <FormImage src={btn_back} size={18} />
      </View>
    )
  }
  return (
    <StyledContainer>
      {status === ProcessStatus.Confirm && <GoBackButton />}
      {status !== ProcessStatus.Input ? (
        <StyledFormTitle>{FormTitleText[status]}</StyledFormTitle>
      ) : (
        <StyledSwitchButton>
          <StyledSwitchSelector
            className="selector"
            style={{
              transform: `translateX(${checked ? '100%' : '0'})`,
              transition: 'transform 300ms',
            }}
          ></StyledSwitchSelector>
          <StyledSwitchCheckbox>
            <input
              className="input"
              type="checkbox"
              checked={checked}
              onChange={(): void => {
                setChecked(!checked)
                //setBridgeUsed(checked ? BridgeType.wormhole : BridgeType.thorswap)
              }}
            />
          </StyledSwitchCheckbox>
        </StyledSwitchButton>
      )}
    </StyledContainer>
  )
}

export default FormTitle
