import { ReactElement } from 'react'
import styled from 'styled-components'
import { Col, Row } from 'react-bootstrap'

import { COLOR, NETWORK, STYLE } from 'consts'

import { BlockChainType } from 'types/network'

import { Text } from 'components'
import FormSelect from 'components/FormSelect'
import FormImage from 'components/FormImage'

const StyledContainer = styled.div`
  border-radius: ${STYLE.css.borderRadius};
  border-style: solid;
  border-color: ${COLOR.darkGray2};
  padding: 15px;
`

const SelectBlockChainBox = ({
  blockChain,
  setBlockChain,
  optionList,
}: {
  blockChain: BlockChainType
  setBlockChain: (value: BlockChainType) => void
  optionList: {
    value: BlockChainType
    label: string
    isDisabled?: boolean | undefined
  }[]
}): ReactElement => {
  return (
    <StyledContainer>
      <Row>
        <Col style={{ textAlign: 'center' }}>
          <FormImage src={NETWORK.blockChainImage[blockChain]} size={40} />
          <div>
            <Text>{NETWORK.blockChainName[blockChain]}</Text>
          </div>
        </Col>
        <Col sm={'auto'}>
          {setBlockChain && (
            <FormSelect
              buttonStyle={{ width: '100%' }}
              defaultValue={blockChain}
              optionList={optionList}
              onSelect={setBlockChain}
              hideSelected
            />
          )}
        </Col>
      </Row>
    </StyledContainer>
  )
}

export default SelectBlockChainBox
