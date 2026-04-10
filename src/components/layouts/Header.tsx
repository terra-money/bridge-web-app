import { ReactElement } from 'react'
import { useRecoilValue } from 'recoil'
import { NavLink } from 'react-router-dom'
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

import { Container, View, Row } from 'components'

import useAuth from 'hooks/useAuth'

import AuthStore from 'store/AuthStore'

import WalletBadge from 'components/WalletBadge'
import { WalletEnum } from 'types/wallet'
import keplrService from 'services/keplrService'
import metaMaskService from 'services/metaMaskService'
import { BlockChainType } from 'types/network'

const Header = (): ReactElement => {
  const cosmosWallet = useRecoilValue(AuthStore.cosmosWallet)
  const evmWallet = useRecoilValue(AuthStore.evmWallet)
  const { loginCosmos, loginEvm, disconnectCosmos, disconnectEvm } = useAuth()

  const connectKeplr = async (): Promise<void> => {
    if (keplrService.checkInstalled()) {
      const { address, signingCosmosClient } = await keplrService.connect(
        BlockChainType.atomone
      )
      await loginCosmos({
        address,
        signer: signingCosmosClient,
        walletType: WalletEnum.Keplr,
      })
    } else {
      window.open('https://www.keplr.app/download', '_blank')
    }
  }

  const connectMetaMask = async (): Promise<void> => {
    if (metaMaskService.checkInstalled()) {
      const { address, provider } = await metaMaskService.connect()
      const walletClient = createWalletClient({
        account: address as `0x${string}`,
        chain: mainnet,
        transport: custom(provider),
      })
      await loginEvm({
        address,
        walletClient,
        walletType: WalletEnum.MetaMask,
      })
    } else {
      metaMaskService.install()
    }
  }

  const navLinkCls = ({ isActive }: { isActive: boolean }): string =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'text-white bg-white/10'
        : 'text-white/60 hover:text-white hover:bg-white/5'
    }`

  return (
    <Container className="relative">
      <Container className="max-w-[960px]">
        <View className="flex-row justify-between items-center pt-[47px] pb-[19px] max-[575px]:p-5">
          {/* Navigation */}
          <Row className="items-center gap-1">
            <NavLink to="/" end className={navLinkCls}>
              Send
            </NavLink>
            <NavLink to="/dashboard" className={navLinkCls}>
              Dashboard
            </NavLink>
            <NavLink to="/ibc-test" className={navLinkCls}>
              IBC Test
            </NavLink>
          </Row>

          {/* Wallet Badges */}
          <Row className="items-center gap-2">
            <WalletBadge
              label="Keplr"
              walletEnum={WalletEnum.Keplr}
              address={cosmosWallet?.address || null}
              onConnect={connectKeplr}
              onDisconnect={disconnectCosmos}
            />
            <WalletBadge
              label="MetaMask"
              walletEnum={WalletEnum.MetaMask}
              address={evmWallet?.address || null}
              onConnect={connectMetaMask}
              onDisconnect={disconnectEvm}
            />
          </Row>
        </View>
      </Container>
    </Container>
  )
}

export default Header
