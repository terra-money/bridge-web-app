import styled from 'styled-components'
import { COLOR } from 'consts'
import { ReactElement, useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import SendStore from 'store/SendStore'
import { BlockChainType } from 'types'

import KeplrImg from 'images/Keplr.png'
import MetamaskImg from 'images/metamask.svg'
import StationImg from 'images/station.png'
import keplrService from 'services/keplrService'
import terraService from 'services/terraService'
import metaMaskService from 'services/metaMaskService'

const StyledAutoCompleteButton = styled.div`
  position: absolute;
  top: 50%;
  margin-top: -13px;
  right: 0;
  background-color: ${COLOR.darkGray2};
  font-size: 12px;
  border-radius: 5px;
  padding: 0 10px;
  line-height: 24px;
  height: 26px;
  display: flex;
  align-items: center;

  cursor: pointer;
  :hover {
    background-color: #323842;
  }
`

const Icon = styled.img`
  width: 20px;
  margin-left: 8px;
`

export default function AutoFillButton(): ReactElement {
  const toBlockChain = useRecoilValue(SendStore.toBlockChain)
  const setToAddress = useSetRecoilState(SendStore.toAddress)

  useEffect(() => {
    setToAddress('')
  }, [toBlockChain])

  if (toBlockChain === BlockChainType.terra) {
    return (
      <StyledAutoCompleteButton
        onClick={async (): Promise<void> => {
          if (terraService.checkInstalled()) {
            const { address } = await terraService.connect()
            setToAddress(address)
          }
        }}
      >
        Autofill
        <Icon src={StationImg} alt="Station" />
      </StyledAutoCompleteButton>
    )
  } else if (
    toBlockChain === BlockChainType.ethereum ||
    toBlockChain === BlockChainType.avalanche
  ) {
    return (
      <StyledAutoCompleteButton
        onClick={async (): Promise<void> => {
          if (metaMaskService.checkInstalled()) {
            const { address } = await metaMaskService.connect()
            setToAddress(address)
          }
        }}
      >
        Autofill
        <Icon src={MetamaskImg} alt="Metamask" />
      </StyledAutoCompleteButton>
    )
  } else {
    return (
      <StyledAutoCompleteButton
        onClick={async (): Promise<void> => {
          if (keplrService.checkInstalled()) {
            const { address } = await keplrService.connect(toBlockChain)
            setToAddress(address)
          }
        }}
      >
        Autofill
        <Icon src={KeplrImg} alt="Keplr" />
      </StyledAutoCompleteButton>
    )
  }
}
