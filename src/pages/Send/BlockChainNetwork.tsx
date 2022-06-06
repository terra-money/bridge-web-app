import { ReactElement } from 'react'
import styled from 'styled-components'
import { useRecoilState, useRecoilValue } from 'recoil'
import wormholeGif from 'images/wormhole.gif'
import ibcGif from 'images/ibc.gif'
import shuttleGif from 'images/shuttle.gif'

import { NETWORK } from 'consts'

import { BlockChainType, BridgeType, getDefaultBridge } from 'types/network'

import useAuth from 'hooks/useAuth'

import SendStore from 'store/SendStore'
import NetworkStore from 'store/NetworkStore'

import SelectBlockChain from '../../components/SelectBlockChain'
import SelectBridge from 'components/SelectBridge'
import useUpdateBridgeType from 'hooks/useUpdateBridgeType'

const StyledNetworkBox = styled.div`
  display: flex;
  padding: 0 40px;

  @media (max-width: 575px) {
    padding: 0;
  }
`

const BackgroundImg = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  background-repeat: no-repeat;
  background-size: 40% 60%;
  background-position: 50% 50%;
`

const BlockChainNetwork = (): ReactElement => {
  const { logout } = useAuth()
  const [toBlockChain, setToBlockChain] = useRecoilState(SendStore.toBlockChain)

  const [fromBlockChain, setFromBlockChain] = useRecoilState(
    SendStore.fromBlockChain
  )
  const isTestnet = useRecoilValue(NetworkStore.isTestnet)
  const [bridgeUsed, setBridgeUsed] = useRecoilState(SendStore.bridgeUsed)
  useUpdateBridgeType()
  const { setBlockchainStorage } = useAuth()

  return (
    <StyledNetworkBox>
      <BackgroundImg
        style={{
          backgroundImage: ((): string => {
            switch (bridgeUsed) {
              case BridgeType.wormhole:
                return `url('${wormholeGif}')`
              case BridgeType.ibc:
              case BridgeType.axelar:
                return `url('${ibcGif}')`
              default:
                return `url('${shuttleGif}')`
            }
          })(),
        }}
      >
        <SelectBlockChain
          {...{
            blockChain: fromBlockChain,
            setBlockChain: (value): void => {
              logout()
              setFromBlockChain(value)
              setToBlockChain(BlockChainType.terra)
              setBridgeUsed(getDefaultBridge(value, BlockChainType.terra))
              setBlockchainStorage({
                fromBlockChain: value,
                toBlockChain: BlockChainType.terra,
                bridgeUsed: getDefaultBridge(value, BlockChainType.terra),
              })
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
              {
                label: NETWORK.blockChainName[BlockChainType.avalanche],
                value: BlockChainType.avalanche,
                isDisabled: fromBlockChain === BlockChainType.avalanche,
              },
              {
                label: NETWORK.blockChainName[BlockChainType.fantom],
                value: BlockChainType.fantom,
                isDisabled: fromBlockChain === BlockChainType.fantom,
              },
              {
                label: NETWORK.blockChainName[BlockChainType.polygon],
                value: BlockChainType.polygon,
                isDisabled: fromBlockChain === BlockChainType.polygon,
              },
            ],
            label: 'FROM',
          }}
        />
        <div style={{ height: '100%', display: 'flex', alignItems: 'start' }}>
          <SelectBridge />
        </div>
        <SelectBlockChain
          {...{
            blockChain: toBlockChain,
            setBlockChain: (b): void => {
              setToBlockChain(b)
              if (fromBlockChain !== BlockChainType.terra) {
                setFromBlockChain(BlockChainType.terra)
                logout()
              }
              setBridgeUsed(getDefaultBridge(BlockChainType.terra, b))
              setBlockchainStorage({
                fromBlockChain: BlockChainType.terra,
                toBlockChain: b,
                bridgeUsed: getDefaultBridge(BlockChainType.terra, b),
              })
            },
            optionList: [
              {
                label: NETWORK.blockChainName[BlockChainType.terra],
                value: BlockChainType.terra,
                isDisabled: toBlockChain === BlockChainType.terra,
              },
              {
                label: NETWORK.blockChainName[BlockChainType.ethereum],
                value: BlockChainType.ethereum,
                isDisabled: toBlockChain === BlockChainType.ethereum,
              },
              {
                label: NETWORK.blockChainName[BlockChainType.bsc],
                value: BlockChainType.bsc,
                isDisabled: toBlockChain === BlockChainType.bsc,
              },
              {
                label: NETWORK.blockChainName[BlockChainType.hmy],
                value: BlockChainType.hmy,
                isDisabled: toBlockChain === BlockChainType.hmy,
              },
              {
                label: NETWORK.blockChainName[BlockChainType.osmo],
                value: BlockChainType.osmo,
                isDisabled: toBlockChain === BlockChainType.osmo || isTestnet,
              },
              {
                label: NETWORK.blockChainName[BlockChainType.scrt],
                value: BlockChainType.scrt,
                isDisabled: toBlockChain === BlockChainType.scrt || isTestnet,
              },
              {
                label: NETWORK.blockChainName[BlockChainType.inj],
                value: BlockChainType.inj,
                isDisabled: toBlockChain === BlockChainType.inj || isTestnet,
              },
              {
                label: NETWORK.blockChainName[BlockChainType.cosmos],
                value: BlockChainType.cosmos,
                isDisabled: toBlockChain === BlockChainType.cosmos || isTestnet,
              },
              {
                label: NETWORK.blockChainName[BlockChainType.avalanche],
                value: BlockChainType.avalanche,
                isDisabled:
                  toBlockChain === BlockChainType.avalanche || isTestnet,
              },
              {
                label: NETWORK.blockChainName[BlockChainType.fantom],
                value: BlockChainType.fantom,
                isDisabled: toBlockChain === BlockChainType.fantom || isTestnet,
              },
              {
                label: NETWORK.blockChainName[BlockChainType.polygon],
                value: BlockChainType.polygon,
                isDisabled:
                  toBlockChain === BlockChainType.polygon || isTestnet,
              },
            ],
            label: 'TO',
          }}
        />
      </BackgroundImg>
    </StyledNetworkBox>
  )
}

export default BlockChainNetwork
