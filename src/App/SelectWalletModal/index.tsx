import { ReactElement, useEffect } from 'react'
import styled from 'styled-components'
import { useRecoilState, useRecoilValue } from 'recoil'
import { ethers } from 'ethers'

import useAuth from 'hooks/useAuth'
import Text from 'components/Text'
import DefaultModal from 'components/Modal'

import terraWalletConnectService from 'services/terraWalletConnectService'
import terraService from 'services/terraService'
import walletConnectService from 'services/walletConnectService'
import coinBaseService from 'services/coinBaseService'
import metaMaskService from 'services/metaMaskService'
import bscService from 'services/bscService'

import SelectWalletStore, {
  SelectWalletModalType,
} from 'store/SelectWalletStore'
import SendStore from 'store/SendStore'

import { WalletEnum } from 'types/wallet'
import { BlockChainType } from 'types/network'

import WalletButton from './WalletButton'

const StyledContainer = styled.div`
  padding: 0 25px 40px;
`

const SelectEtherBaseWalletModal = (): ReactElement => {
  const { login, logout, getLoginStorage, setLoginStorage } = useAuth()
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)

  const [isVisibleModalType, setIsVisibleModalType] = useRecoilState(
    SelectWalletStore.isVisibleModalType
  )

  const onClickTerraExtension = async (): Promise<void> => {
    const terraExtInstalled = terraService.checkInstalled()
    if (terraExtInstalled) {
      const result = await terraService.connect()

      await login({
        user: {
          address: result.address,
          walletType: WalletEnum.TerraExtension,
        },
      })
    } else {
      setIsVisibleModalType(SelectWalletModalType.terraExtInstall)
    }
  }

  const onClickTerraWalletConnect = async (): Promise<void> => {
    try {
      const connector = await terraWalletConnectService.connect()
      connector.on('disconnect', (): void => {
        logout()
      })

      if (connector.connected) {
        login({
          user: {
            address: connector.accounts[0],
            terraWalletConnect: connector,
            walletType: WalletEnum.TerraWalletConnect,
          },
        })
      } else {
        connector.on('connect', (error, payload) => {
          if (error) {
            throw error
          }
          const address = payload.params[0].accounts[0]
          login({
            user: {
              address,
              terraWalletConnect: connector,
              walletType: WalletEnum.TerraWalletConnect,
            },
          })
        })
      }
    } catch (e) {
      // if user close connect modal then error
      console.log(e)
    }
  }
  const onClickBinanceChain = async (): Promise<void> => {
    if (bscService.checkInstalled()) {
      const { address, provider } = await bscService.connect()
      await login({
        user: {
          address,
          provider: new ethers.providers.Web3Provider(provider),
          walletType: WalletEnum.Binance,
        },
      })
    } else {
      setIsVisibleModalType(SelectWalletModalType.bscInstall)
    }
  }

  const onClickMetamask = async (): Promise<void> => {
    if (metaMaskService.checkInstalled()) {
      const { address, provider } = await metaMaskService.connect()

      await login({
        user: {
          address,
          provider: new ethers.providers.Web3Provider(provider),
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
          walletType: WalletEnum.WalletConnect,
        },
      })
    } catch (e) {
      // if user close connect modal then error
      console.log(e)
    }
  }

  const onClickCoinbase = async (): Promise<void> => {
    try {
      const { address, provider } = await coinBaseService.connect()
      await login({
        user: {
          address,
          provider: new ethers.providers.Web3Provider(provider),
          walletType: WalletEnum.CoinbaseWallet,
        },
      })
    } catch (e) {
      // if user close connect modal then error
      console.log(e)
    }
  }

  const onClickWallet = (wallet: WalletEnum): void => {
    switch (wallet) {
      case WalletEnum.Binance:
        onClickBinanceChain()
        break
      case WalletEnum.MetaMask:
        onClickMetamask()
        break
      case WalletEnum.CoinbaseWallet:
        onClickCoinbase()
        break
      case WalletEnum.WalletConnect:
        onClickWalletConnect()
        break
      case WalletEnum.TerraExtension:
        onClickTerraExtension()
        break
      case WalletEnum.TerraWalletConnect:
        onClickTerraWalletConnect()
        break
    }
  }

  let buttons = [WalletEnum.TerraExtension, WalletEnum.TerraWalletConnect]
  if (
    fromBlockChain === BlockChainType.ethereum ||
    fromBlockChain === BlockChainType.hmy
  ) {
    buttons = [
      WalletEnum.MetaMask,
      WalletEnum.WalletConnect,
      WalletEnum.CoinbaseWallet,
    ]
  } else if (fromBlockChain === BlockChainType.bsc) {
    buttons = [WalletEnum.Binance, WalletEnum.MetaMask]
  }

  useEffect(() => {
    const { lastWalletType } = getLoginStorage()
    if (
      isVisibleModalType === SelectWalletModalType.selectWallet &&
      lastWalletType
    ) {
      onClickWallet(lastWalletType)
      setLoginStorage()
      setIsVisibleModalType(undefined)
    }
  }, [isVisibleModalType])

  return (
    <DefaultModal
      {...{
        isOpen: isVisibleModalType === SelectWalletModalType.selectWallet,
        close: (): void => {
          setIsVisibleModalType(undefined)
        },
      }}
      header={<Text style={{ justifyContent: 'center' }}>Connect Wallet</Text>}
    >
      <StyledContainer>
        {buttons.map((wallet, i) => (
          <WalletButton
            key={`wallet-${i}`}
            onClick={(): void => {
              setIsVisibleModalType(undefined)
              onClickWallet(wallet)
            }}
            wallet={wallet}
          />
        ))}
      </StyledContainer>
    </DefaultModal>
  )
}

export default SelectEtherBaseWalletModal
