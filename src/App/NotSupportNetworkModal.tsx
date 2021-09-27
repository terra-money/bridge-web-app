import { ReactElement } from 'react'
import styled from 'styled-components'
import { useRecoilState, useRecoilValue } from 'recoil'

import { COLOR } from 'consts'
import { Text } from 'components'
import DefaultModal from 'components/Modal'

import NetworkStore from 'store/NetworkStore'
import { BlockChainType } from 'types'

const StyledContainer = styled.div`
  padding: 20px;
`

const StyledTitle = styled(Text)`
  display: block;
  font-size: 24;
  font-weight: 500;
  color: ${COLOR.skyGray};
  font-size: 14px;
`

const StyledInfoText = styled(Text)`
  display: block;
  font-size: 14px;
`

const NotSupportNetworkModal = (): ReactElement => {
  const [isVisibleModal, setIsVisibleModal] = useRecoilState(
    NetworkStore.isVisibleNotSupportNetworkModal
  )
  const network = useRecoilValue(NetworkStore.triedNotSupportNetwork)
  return (
    <DefaultModal
      {...{
        isOpen: isVisibleModal,
        close: (): void => {
          setIsVisibleModal(false)
        },
      }}
      header={
        <Text style={{ justifyContent: 'center' }}>UNSUPPORTED NETWORK</Text>
      }
    >
      <StyledContainer>
        {network && (
          <>
            <div style={{ marginBottom: 20 }}>
              <StyledTitle>Your network</StyledTitle>
              <StyledInfoText>Name : {network.name}</StyledInfoText>
              <StyledInfoText>Chain ID : {network.chainId}</StyledInfoText>
            </div>
            {network.blockChain === BlockChainType.ethereum ? (
              <div>
                <StyledTitle>Supported networks</StyledTitle>
                <StyledInfoText>Ethereum Mainnet. Chain ID : 1</StyledInfoText>
                <StyledInfoText>
                  Ethereum Testnet Ropsten. Chain ID : 3
                </StyledInfoText>
                <StyledInfoText>
                  Binance Smart Chain Mainnet. Chain ID : 56{' '}
                </StyledInfoText>
                <StyledInfoText>
                  Binance Smart Chain Testnet. Chain ID : 97
                </StyledInfoText>
              </div>
            ) : (
              <div>
                <StyledTitle>Supported networks</StyledTitle>
                <StyledInfoText>Terra Mainnet</StyledInfoText>
                <StyledInfoText>Terra Testnet Bombay</StyledInfoText>
              </div>
            )}
          </>
        )}
      </StyledContainer>
    </DefaultModal>
  )
}

export default NotSupportNetworkModal
