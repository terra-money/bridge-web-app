import { ReactElement } from 'react'
import styled from 'styled-components'

import { NETWORK, COLOR } from 'consts'

import { BlockChainType, BridgeType } from 'types/network'

import { Text } from 'components'
import FormSelect from 'components/FormSelect'
import FormImage from 'components/FormImage'
import { useRecoilValue } from 'recoil'
import SendProcessStore, { ProcessStatus } from 'store/SendProcessStore'
import SendStore from 'store/SendStore'

import bridgeFrom from 'images/bridgeFrom.svg'
import bridgeTo from 'images/bridgeTo.svg'

const StyledContainer = styled.div`
  width: 160px;
  position: relative;

  @media only screen and (max-width: 450px) {
    width: 140px;
  }
`

const StyledCircle = styled.div`
  height: 140px;
  width: 140px;
  margin: 0 auto;
  justify-content: center;
  align-items: flex-start;
  display: flex;

  background-repeat: no-repeat;
  background-size: 100%;
  background-color: ${COLOR.darkGray};
  border-radius: 50%;
  border: 1px solid #4abcf0;

  @media only screen and (max-width: 450px) {
    height: 110px;
    width: 110px;
  }
`

const StyledLabel = styled(Text)`
  padding-top: 12px;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #a3a3a3;
  justify-content: center;

  @media only screen and (max-width: 450px) {
    padding-top: 4px;
    font-size: 11px;
  }
`

const StyledBlockChainLabel = styled(Text)`
  padding-top: 6px;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #e9e9e9;
  justify-content: center;
`

const SelectBlockChain = ({
  blockChain,
  setBlockChain,
  optionList,
  label,
}: {
  blockChain: BlockChainType
  setBlockChain: (value: BlockChainType) => void
  optionList: {
    value: BlockChainType
    label: string
    isDisabled?: boolean
  }[]
  label: string
}): ReactElement => {
  const status = useRecoilValue(SendProcessStore.sendProcessStatus)
  const bridgeUsed = useRecoilValue(SendStore.bridgeUsed)

  return (
    <StyledContainer>
      <StyledCircle
        style={{
          border: label === 'FROM' ? '1px solid #4ABCF0' : '1px solid #BB7CB3',
          backgroundImage:
            bridgeUsed === BridgeType.wormhole
              ? `url("${label === 'FROM' ? bridgeFrom : bridgeTo}")`
              : '',
          boxShadow: label === 'FROM' ? '0 0 6px #4ABCF0' : '0 0 6px #BB7CB3',
        }}
      >
        <div style={{ paddingTop: 28 }}>
          <FormImage
            src={NETWORK.blockChainImage[blockChain]}
            size={window.innerWidth > 450 ? 54 : 38}
          />
          {status === ProcessStatus.Input ? (
            <StyledLabel>{label}</StyledLabel>
          ) : (
            <StyledBlockChainLabel>
              {NETWORK.blockChainName[blockChain]}
            </StyledBlockChainLabel>
          )}
        </div>
      </StyledCircle>

      {status === ProcessStatus.Input && (
        <div style={{ position: 'absolute', width: '100%', marginTop: -24 }}>
          {setBlockChain && (
            <FormSelect
              icons={true}
              selectedValue={blockChain}
              optionList={optionList}
              onSelect={setBlockChain}
              containerStyle={{
                width: '100%',
                textAlign: 'left',
              }}
              selectedTextStyle={{
                fontSize: window.innerWidth > 450 ? '16px' : '14px',
                fontWeight: '400',
              }}
            />
          )}
        </div>
      )}
    </StyledContainer>
  )
}

export default SelectBlockChain
