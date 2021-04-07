import { useRecoilState, useSetRecoilState } from 'recoil'
import { Network } from '@ethersproject/networks'

import { NETWORK } from 'consts'

import SendStore from 'store/SendStore'
import AuthStore, { initLoginUser } from 'store/AuthStore'
import NetworkStore from 'store/NetworkStore'

import terraService from 'services/terraService'

import { User } from 'types/auth'
import { BlockChainType } from 'types/network'
import { WalletEnum } from 'types/wallet'

const useAuth = (): {
  login: ({ user }: { user: User }) => Promise<void>
  logout: () => void
  getLoginStorage: () => {
    lastFromBlockChain?: BlockChainType
    lastWalletType?: WalletEnum
  }
  setLoginStorage: (props?: {
    blockChain: BlockChainType
    walletType: WalletEnum
  }) => void
} => {
  const setLoginUser = useSetRecoilState(AuthStore.loginUser)
  const setEtherBaseExt = useSetRecoilState(NetworkStore.etherBaseExt)
  const setTerraExt = useSetRecoilState(NetworkStore.terraExt)
  const setTerraLocal = useSetRecoilState(NetworkStore.terraLocal)
  const setIsVisibleNotSupportNetworkModal = useSetRecoilState(
    NetworkStore.isVisibleNotSupportNetworkModal
  )
  const setTriedNotSupportNetwork = useSetRecoilState(
    NetworkStore.triedNotSupportNetwork
  )

  const [fromBlockChain, setFromBlockChain] = useRecoilState(
    SendStore.fromBlockChain
  )

  const checkIsValidEtherNetwork = ({
    network,
  }: {
    network?: Network
  }): boolean => {
    if (network) {
      const { ETH_CHAINID } = NETWORK
      return [
        ETH_CHAINID.ETH_MAIN,
        ETH_CHAINID.ETH_ROPSTEN,
        ETH_CHAINID.BSC_MAIN,
        ETH_CHAINID.BSC_TEST,
      ].includes(network.chainId)
    }

    return false
  }

  const login = async ({ user }: { user: User }): Promise<void> => {
    if (fromBlockChain === BlockChainType.terra) {
      const extNet = await terraService.info()
      setTerraExt(extNet)
      const localNetwork = NETWORK.terra_networks[extNet.name]
      setTerraLocal(localNetwork)
      setLoginStorage({
        blockChain: BlockChainType.terra,
        walletType: WalletEnum.TerraStation,
      })
    }
    // both ethereum , bsc are ethereum base blockchain
    else {
      const network = await user.provider?.getNetwork()
      const isValidEtherNetwork = checkIsValidEtherNetwork({ network })
      if (network && isValidEtherNetwork) {
        const { ETH_CHAINID } = NETWORK

        const reSelectFromBlockChain = [
          ETH_CHAINID.ETH_MAIN,
          ETH_CHAINID.ETH_ROPSTEN,
        ].includes(network.chainId)
          ? BlockChainType.ethereum
          : BlockChainType.bsc
        setFromBlockChain(reSelectFromBlockChain)
        setEtherBaseExt(network)

        setLoginStorage({
          blockChain: reSelectFromBlockChain,
          walletType: user.walletType,
        })
      } else {
        setIsVisibleNotSupportNetworkModal(true)
        setTriedNotSupportNetwork(network)
        return
      }
    }
    // DON'T MOVE
    // set user have to be after set network info
    setLoginUser(user)
  }

  enum LocalStorageKey {
    lastFromBlockChain = 'lastFromBlockChain',
    lastWalletType = 'lastWalletType',
  }

  const setLoginStorage = (props?: {
    blockChain: BlockChainType
    walletType: WalletEnum
  }): void => {
    localStorage.setItem(
      LocalStorageKey.lastFromBlockChain,
      props?.blockChain || ''
    )
    localStorage.setItem(
      LocalStorageKey.lastWalletType,
      props?.walletType || ''
    )
  }

  const getLoginStorage = (): {
    lastFromBlockChain?: BlockChainType
    lastWalletType?: WalletEnum
  } => {
    return {
      lastFromBlockChain: localStorage.getItem(
        LocalStorageKey.lastFromBlockChain
      ) as BlockChainType,
      lastWalletType: localStorage.getItem(
        LocalStorageKey.lastWalletType
      ) as WalletEnum,
    }
  }

  const logout = (): void => {
    setLoginUser(initLoginUser)
    setEtherBaseExt(undefined)
    setTerraExt(undefined)
    setLoginStorage()
  }

  return { login, logout, getLoginStorage, setLoginStorage }
}

export default useAuth
