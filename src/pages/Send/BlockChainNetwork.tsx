import { ReactElement } from 'react'
import styled from 'styled-components'
import { useRecoilState } from 'recoil'
import electric from 'images/electric.gif'

import { NETWORK } from 'consts'

import { BlockChainType } from 'types/network'

import useAuth from 'hooks/useAuth'

import SendStore from 'store/SendStore'

import SelectBlockChain from '../../components/SelectBlockChain'
import FormImage from 'components/FormImage'

const StyledNetworkBox = styled.div`
  display: flex;
  align-items: center;
  padding: 0 50px;

  @media (max-width: 575px) {
    padding: 0;
  }
`

const BlockChainNetwork = (): ReactElement => {
  const { logout } = useAuth()
  const [toBlockChain, setToBlockChain] = useRecoilState(SendStore.toBlockChain)

  const [fromBlockChain, setFromBlockChain] = useRecoilState(
    SendStore.fromBlockChain
  )

  return (
    <StyledNetworkBox>
      <SelectBlockChain
        {...{
          blockChain: fromBlockChain,
          setBlockChain: (value): void => {
            logout()
            setFromBlockChain(value)
          },
          optionList: [
            {
              label: NETWORK.blockChainName[BlockChainType.terra],
              value: BlockChainType.terra,
              isDisabled: fromBlockChain === BlockChainType.terra,
            },
            {
              label: NETWORK.blockChainName[BlockChainType.ethereum],
              value: BlockChainType.ethereum,
              isDisabled: fromBlockChain === BlockChainType.ethereum,
            },
            {
              label: NETWORK.blockChainName[BlockChainType.bsc],
              value: BlockChainType.bsc,
              isDisabled: fromBlockChain === BlockChainType.bsc,
            },
            {
              label: NETWORK.blockChainName[BlockChainType.hmy],
              value: BlockChainType.hmy,
              isDisabled: fromBlockChain === BlockChainType.hmy,
            },
          ],
          label: 'FROM',
        }}
      />

      <FormImage
        src={electric}
        style={{
          flex: 1,
          height: 70,
          backgroundSize: 'cover',
        }}
      />

      <SelectBlockChain
        {...{
          blockChain: toBlockChain,
          setBlockChain: setToBlockChain,
          optionList: [
            {
              label: NETWORK.blockChainName[BlockChainType.terra],
              value: BlockChainType.terra,
              isDisabled: toBlockChain === BlockChainType.terra,
            },
            {
              label: NETWORK.blockChainName[BlockChainType.ethereum],
              value: BlockChainType.ethereum,
              isDisabled:
                fromBlockChain === BlockChainType.bsc ||
                fromBlockChain === BlockChainType.hmy ||
                toBlockChain === BlockChainType.ethereum,
            },
            {
              label: NETWORK.blockChainName[BlockChainType.bsc],
              value: BlockChainType.bsc,
              isDisabled:
                fromBlockChain === BlockChainType.ethereum ||
                fromBlockChain === BlockChainType.hmy ||
                toBlockChain === BlockChainType.bsc,
            },
            {
              label: NETWORK.blockChainName[BlockChainType.hmy],
              value: BlockChainType.hmy,
              isDisabled:
                fromBlockChain === BlockChainType.ethereum ||
                fromBlockChain === BlockChainType.bsc ||
                toBlockChain === BlockChainType.hmy,
            },
          ],
          label: 'TO',
        }}
      />
    </StyledNetworkBox>
  )
}

export default BlockChainNetwork
