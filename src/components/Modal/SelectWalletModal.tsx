import { Fragment, ReactElement } from 'react'
import styled from 'styled-components'
import DefaultModal, { useModal } from '.'
import { ethers } from 'ethers'

import Button from 'components/Button'
import Text from 'components/Text'
import walletConnectService from 'services/walletConnectService'
import coinBaseService from 'services/coinBaseService'
import metaMaskService from 'services/metaMaskService'
import useAuth from 'hooks/useAuth'
import bscService from 'services/bscService'
import terraService from 'services/terraService'
import { useRecoilState } from 'recoil'
import SelectWalletStore from 'store/SelectWalletStore'
import { COLOR, WALLET } from 'consts'
import { BlockChainType } from 'types/network'

import TerraExtensionDownModal from './TerraExtensionDownModal'
import { WalletEnum } from 'types/wallet'

const { walletLogo } = WALLET

const StyledContainer = styled.div`
  padding: 0 30px 30px;
`

const StyledWalletButton = styled(Button)`
  border-radius: 0.5em;
  padding: 16px;
  margin: 12px 0px;
  border: 1px solid #1e2026;
  transition: all 0.3s ease 0s;
  background: #2b2f36;
  color: ${COLOR.white};

  :hover {
    border-color: #f8d12f;
    background: #2b2f36;
  }
`

const StyledButtonContents = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const SelectWalletModal = (): ReactElement => {
  const { login, logout } = useAuth()
  const installTerraExt = useModal()
  const [isVisibleModal, setIsVisibleModal] = useRecoilState(
    SelectWalletStore.isVisibleModal
  )
  const onClickTerra = async (): Promise<void> => {
    const terraExtInstalled = terraService.checkInstalled()
    if (terraExtInstalled) {
      const result = await terraService.connect()
      await login({
        user: {
          blockChain: BlockChainType.terra,
          address: result.address,
          walletType: WalletEnum.TerraStation,
        },
      })
    } else {
      installTerraExt.open()
    }
  }
  const onClickBinanceChain = async (): Promise<void> => {
    const { address, provider } = await bscService.connect()
    await login({
      user: {
        address,
        provider: new ethers.providers.Web3Provider(provider),
        blockChain: BlockChainType.bsc,
        walletType: WalletEnum.Binance,
      },
    })
  }

  const onClickMetamask = async (): Promise<void> => {
    if (metaMaskService.checkInstalled()) {
      const { address, provider } = await metaMaskService.connect()
      await login({
        user: {
          address,
          provider: new ethers.providers.Web3Provider(provider),
          blockChain: BlockChainType.ethereum,
          walletType: WalletEnum.MetaMask,
        },
      })
    } else {
      metaMaskService.install()
    }
  }

  const onClickWalletConnect = async (): Promise<void> => {
    try {
      const { address, provider } = await walletConnectService.connect()
      provider.on('disconnect', () => {
        logout()
      })
      await login({
        user: {
          address,
          provider: new ethers.providers.Web3Provider(provider),
          blockChain: BlockChainType.ethereum,
          walletType: WalletEnum.WalletConnect,
        },
      })
    } catch (e) {
      // if user close connect modal then error
      console.log(e)
    }
  }

  const onClickCoinbase = async (): Promise<void> => {
    const { address, provider } = await coinBaseService.connect()
    await login({
      user: {
        address,
        provider: new ethers.providers.Web3Provider(provider),
        blockChain: BlockChainType.ethereum,
        walletType: WalletEnum.CoinbaseWallet,
      },
    })
  }

  const buttons = [
    {
      src: walletLogo[WalletEnum.TerraStation],
      label: 'Terra',
      onClick: onClickTerra,
    },
    {
      src: walletLogo[WalletEnum.Binance],
      label: 'BinanceChain',
      onClick: onClickBinanceChain,
    },
    {
      src: walletLogo[WalletEnum.MetaMask],
      label: 'Metamask',
      onClick: onClickMetamask,
    },
    {
      src: walletLogo[WalletEnum.WalletConnect],
      label: 'WalletConnect',
      onClick: onClickWalletConnect,
    },
    {
      src: walletLogo[WalletEnum.CoinbaseWallet],
      label: 'Coinbase Wallet',
      onClick: onClickCoinbase,
    },
  ]

  return (
    <>
      <DefaultModal
        {...{
          isOpen: isVisibleModal,
          close: (): void => {
            setIsVisibleModal(false)
          },
        }}
        header={<Text>Connect Wallet</Text>}
      >
        <StyledContainer>
          {buttons.map(({ src, label, onClick }) => (
            <Fragment key={label}>
              <StyledWalletButton
                onClick={(): void => {
                  setIsVisibleModal(false)
                  onClick()
                }}
              >
                <StyledButtonContents>
                  <span>{label}</span>
                  <img src={src} width={24} height={24} alt="" />
                </StyledButtonContents>
              </StyledWalletButton>
            </Fragment>
          ))}
        </StyledContainer>
      </DefaultModal>
      <TerraExtensionDownModal {...installTerraExt} />
    </>
  )
}

export default SelectWalletModal
