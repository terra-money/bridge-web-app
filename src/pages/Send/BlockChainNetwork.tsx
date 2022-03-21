import { ReactElement } from 'react'
import styled from 'styled-components'
import { useRecoilState, useRecoilValue } from 'recoil'
import electric from 'images/electric.gif'

import { NETWORK } from 'consts'

import { BlockChainType } from 'types/network'

import useAuth from 'hooks/useAuth'

import SendStore from 'store/SendStore'
import NetworkStore from 'store/NetworkStore'

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
  const isTestnet = useRecoilValue(NetworkStore.isTestnet)

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
            {
              label: NETWORK.blockChainName[BlockChainType.osmo],
              value: BlockChainType.osmo,
              isDisabled: fromBlockChain === BlockChainType.osmo,
            },
            {
              label: NETWORK.blockChainName[BlockChainType.scrt],
              value: BlockChainType.scrt,
              isDisabled: fromBlockChain === BlockChainType.scrt,
            },
            {
              label: NETWORK.blockChainName[BlockChainType.inj],
              value: BlockChainType.inj,
              isDisabled: fromBlockChain === BlockChainType.inj,
            },
            {
              label: NETWORK.blockChainName[BlockChainType.cosmos],
              value: BlockChainType.cosmos,
              isDisabled: fromBlockChain === BlockChainType.cosmos,
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
                fromBlockChain !== BlockChainType.terra ||
                toBlockChain === BlockChainType.ethereum,
            },
            {
              label: NETWORK.blockChainName[BlockChainType.bsc],
              value: BlockChainType.bsc,
              isDisabled:
                fromBlockChain !== BlockChainType.terra ||
                toBlockChain === BlockChainType.bsc,
            },
            {
              label: NETWORK.blockChainName[BlockChainType.hmy],
              value: BlockChainType.hmy,
              isDisabled:
                fromBlockChain !== BlockChainType.terra ||
                toBlockChain === BlockChainType.hmy,
            },
            {
              label: NETWORK.blockChainName[BlockChainType.osmo],
              value: BlockChainType.osmo,
              isDisabled:
                fromBlockChain !== BlockChainType.terra ||
                toBlockChain === BlockChainType.osmo ||
                isTestnet,
            },
            {
              label: NETWORK.blockChainName[BlockChainType.scrt],
              value: BlockChainType.scrt,
              isDisabled:
                fromBlockChain !== BlockChainType.terra ||
                toBlockChain === BlockChainType.scrt ||
                isTestnet,
            },
            {
              label: NETWORK.blockChainName[BlockChainType.inj],
              value: BlockChainType.inj,
              isDisabled:
                fromBlockChain !== BlockChainType.terra ||
                toBlockChain === BlockChainType.inj ||
                isTestnet,
            },
            {
              label: NETWORK.blockChainName[BlockChainType.cosmos],
              value: BlockChainType.cosmos,
              isDisabled:
                fromBlockChain !== BlockChainType.terra ||
                toBlockChain === BlockChainType.cosmos ||
                isTestnet,
            },
            {
              label: NETWORK.blockChainName[BlockChainType.avalanche],
              value: BlockChainType.avalanche,
              isDisabled:
                fromBlockChain !== BlockChainType.terra ||
                toBlockChain === BlockChainType.avalanche ||
                isTestnet,
            },
            {
              label: NETWORK.blockChainName[BlockChainType.fantom],
              value: BlockChainType.fantom,
              isDisabled:
                fromBlockChain !== BlockChainType.terra ||
                toBlockChain === BlockChainType.fantom ||
                isTestnet,
            },
            /*
            {
              label: NETWORK.blockChainName[BlockChainType.cro],
              value: BlockChainType.cro,
              isDisabled: toBlockChain !== BlockChainType.terra,
            },
            */
          ],
          label: 'TO',
        }}
      />
    </StyledNetworkBox>
  )
}

export default BlockChainNetwork
