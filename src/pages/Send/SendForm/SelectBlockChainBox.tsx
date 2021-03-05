import { ReactElement } from 'react'
import styled from 'styled-components'
import { useRecoilValue } from 'recoil'
import { Col, Row } from 'react-bootstrap'

import { COLOR, NETWORK } from 'consts'

import { BlockChainType } from 'types/network'

import { Text } from 'components'
import FormSelect from 'components/FormSelect'

import AuthStore from 'store/AuthStore'
import FormImage from 'components/FormImage'

const StyledContainer = styled.div`
  border-radius: 5px;
  border-style: solid;
  border-color: ${COLOR.darkGray2};
  padding: 15px;
`

const SelectBlockChainBox = ({
  blockChain,
  setBlockChain,
}: {
  blockChain: BlockChainType
  setBlockChain?: (value: BlockChainType) => void
}): ReactElement => {
  const loginUser = useRecoilValue(AuthStore.loginUser)

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
              optionList={[
                {
                  label: NETWORK.blockChainName[BlockChainType.terra],
                  value: BlockChainType.terra,
                },
                {
                  label: NETWORK.blockChainName[BlockChainType.ethereum],
                  value: BlockChainType.ethereum,
                  isDisabled: loginUser.blockChain === BlockChainType.bsc,
                },
                {
                  label: NETWORK.blockChainName[BlockChainType.bsc],
                  value: BlockChainType.bsc,
                  isDisabled: loginUser.blockChain === BlockChainType.ethereum,
                },
              ]}
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
