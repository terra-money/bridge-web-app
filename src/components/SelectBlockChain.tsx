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
  align-items: center;
  justify-content: center;
  display: flex;
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
        <div style={{ textAlign: 'center' }}>
          <FormImage src={NETWORK.blockChainImage[blockChain]} size={40} />
          <div>
            {status === ProcessStatus.Input ? (
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#727e8b',
                }}
              >
                {label}
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#e9e9e9',
                }}
              >
                {NETWORK.blockChainName[blockChain]}
              </Text>
            )}
          </div>
        </div>
      </StyledCircle>

      {status === ProcessStatus.Input && (
        <div style={{ position: 'absolute', width: '100%', marginTop: -30 }}>
          {setBlockChain && (
            <FormSelect
              selectedValue={blockChain}
              optionList={optionList}
              onSelect={setBlockChain}
            />
          )}
        </div>
      )}
    </StyledContainer>
  )
}

export default SelectBlockChain
