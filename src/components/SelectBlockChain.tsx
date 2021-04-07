import { ReactElement } from 'react'
import styled from 'styled-components'

import { NETWORK } from 'consts'

import { BlockChainType } from 'types/network'

import { Text } from 'components'
import FormSelect from 'components/FormSelect'
import FormImage from 'components/FormImage'
import { useRecoilValue } from 'recoil'
import SendProcessStore, { ProcessStatus } from 'store/SendProcessStore'

const StyledContainer = styled.div`
  width: 128px;
  margin: auto;
  position: relative;
`

const StyledCircle = styled.div`
  height: 128px;
  border-radius: 100px;
  border: 1px solid #4abcf0;
  box-shadow: 0 2px 4px 0 rgba(104, 99, 254, 0.3),
    0 -1px 4px 0 rgba(119, 232, 255, 0.5);
  justify-content: center;
  align-items: flex-start;
  display: flex;
`

const StyledLabel = styled(Text)`
  padding-top: 6px;
  font-size: 10px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #727e8b;
  justify-content: center;
`

const StyledBlockChainLabel = styled(Text)`
  padding-top: 6px;
  font-size: 14px;
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
  return (
    <StyledContainer>
      <StyledCircle>
        <div style={{ paddingTop: 28 }}>
          <FormImage src={NETWORK.blockChainImage[blockChain]} size={52} />
          <div>
            {status === ProcessStatus.Input ? (
              <StyledLabel>{label}</StyledLabel>
            ) : (
              <StyledBlockChainLabel>
                {NETWORK.blockChainName[blockChain]}
              </StyledBlockChainLabel>
            )}
          </div>
        </div>
      </StyledCircle>

      {status === ProcessStatus.Input && (
        <div style={{ position: 'absolute', width: '100%', marginTop: -20 }}>
          {setBlockChain && (
            <FormSelect
              selectedValue={blockChain}
              optionList={optionList}
              onSelect={setBlockChain}
              containerStyle={{
                width: '100%',
                textAlign: 'left',
              }}
            />
          )}
        </div>
      )}
    </StyledContainer>
  )
}

export default SelectBlockChain
