import { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useRecoilState, useRecoilValue } from 'recoil'
import electric from 'images/electric.gif'

import { NETWORK, STYLE } from 'consts'

import { BlockChainType } from 'types/network'

import useAuth from 'hooks/useAuth'

import SendStore from 'store/SendStore'

import SelectBlockChain from '../../components/SelectBlockChain'
import useSelectWallet from 'hooks/useSelectWallet'
import FormImage from 'components/FormImage'
import AuthStore from 'store/AuthStore'

const StyledNetworkBox = styled.div`
  display: flex;
  align-items: center;
  padding: 0 50px;

  @media (max-width: 575px) {
    padding: 0;
  }
`

const BlockChainNetwork = (): ReactElement => {
  const { logout, getLoginStorage } = useAuth()
  const [initPage, setInitPage] = useState(false)
  const [toBlockChain, setToBlockChain] = useRecoilState(SendStore.toBlockChain)
  const isLoggedIn = useRecoilValue(AuthStore.isLoggedIn)

  const [fromBlockChain, setFromBlockChain] = useRecoilState(
    SendStore.fromBlockChain
  )

  const selectWallet = useSelectWallet()

  useEffect(() => {
    setInitPage(true)
    const { lastFromBlockChain } = getLoginStorage()

    if (lastFromBlockChain) {
      // default network is terra
      if (lastFromBlockChain === BlockChainType.terra) {
        selectWallet.open()
      } else {
        setFromBlockChain(lastFromBlockChain)
      }
    }
  }, [])

  useEffect(() => {
    if (initPage) {
      if (STYLE.isSupportBrowser && false === isLoggedIn) {
        selectWallet.open()
      }

      if (
        (fromBlockChain === BlockChainType.ethereum &&
          toBlockChain === BlockChainType.bsc) ||
        (fromBlockChain === BlockChainType.bsc &&
          toBlockChain === BlockChainType.ethereum)
      ) {
        setToBlockChain(BlockChainType.terra)
      }
    }
  }, [fromBlockChain])

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
                toBlockChain === BlockChainType.ethereum,
            },
            {
              label: NETWORK.blockChainName[BlockChainType.bsc],
              value: BlockChainType.bsc,
              isDisabled:
                fromBlockChain === BlockChainType.ethereum ||
                toBlockChain === BlockChainType.bsc,
            },
          ],
          label: 'TO',
        }}
      />
    </StyledNetworkBox>
  )
}

export default BlockChainNetwork
