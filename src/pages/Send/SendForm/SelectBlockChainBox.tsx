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
  box-shadow: rgba(0, 0, 0, 0.5) 0px 3px 9px;
  border-color: ${COLOR.darkGray2};
  padding: 20px 15px 15px;
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
    isDisabled?: boolean
  }[]
}): ReactElement => {
  return (
    <StyledContainer>
      <Row>
        <Col lg={2}></Col>
        <Col style={{ textAlign: 'center' }}>
          <FormImage src={NETWORK.blockChainImage[blockChain]} size={40} />
          <div>
            <Text style={{ fontSize: 14 }}>
              {NETWORK.blockChainName[blockChain]}
            </Text>
          </div>
        </Col>
        <Col
          lg={3}
          style={{ alignSelf: 'center', paddingBottom: 5, textAlign: 'center' }}
        >
          {setBlockChain && (
            <FormSelect
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
