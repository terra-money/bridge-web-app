import { useRecoilState, useSetRecoilState } from 'recoil'
import { Network } from '@ethersproject/networks'
import _ from 'lodash'

import { NETWORK } from 'consts'

import SendStore from 'store/SendStore'
import AuthStore, { initLoginUser } from 'store/AuthStore'
import NetworkStore from 'store/NetworkStore'

import terraService from 'services/terraService'

import { User } from 'types/auth'
import { BlockChainType, LocalTerraNetwork } from 'types/network'
import { WalletEnum } from 'types/wallet'
import SendProcessStore, { ProcessStatus } from 'store/SendProcessStore'
import useTerraNetwork from './useTerraNetwork'

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
  const { getTerraNetworkByName, getTerraNetworkByWalletconnectID } =
    useTerraNetwork()

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
  const setStatus = useSetRecoilState(SendProcessStore.sendProcessStatus)

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
        ETH_CHAINID.HMY_MAIN,
        ETH_CHAINID.HMY_TEST,
      ].includes(network.chainId)
    }

    return false
  }

  const login = async ({ user }: { user: User }): Promise<void> => {
    if (fromBlockChain === BlockChainType.terra) {
      let localNetwork: LocalTerraNetwork | undefined
      let name = ''
      let chainId: string | number = ''
      if (user.walletType === WalletEnum.TerraWalletConnect) {
        const walletConneceId = user.terraWalletConnect?.chainId
        chainId = walletConneceId || ''
        localNetwork = _.isNumber(walletConneceId)
          ? getTerraNetworkByWalletconnectID(walletConneceId)
          : undefined
        setTerraExt(localNetwork)
      } else {
        const extNet = await terraService.info()
        name = extNet.name
        chainId = extNet.chainID
        setTerraExt(extNet)
        localNetwork = getTerraNetworkByName(extNet.name)
      }

      if (!localNetwork) {
        setIsVisibleNotSupportNetworkModal(true)
        setTriedNotSupportNetwork({
          blockChain: BlockChainType.terra,
          name,
          chainId,
        })
        return
      }

      setTerraLocal(localNetwork)
      setLoginStorage({
        blockChain: BlockChainType.terra,
        walletType: user.walletType,
      })
    }
    // ethereum, bsc, hmy are ethereum base blockchain
    else {
      const network = await user.provider?.getNetwork()
      const isValidEtherNetwork = checkIsValidEtherNetwork({ network })
      if (network && isValidEtherNetwork) {
        const { ETH_CHAINID } = NETWORK

        let reSelectFromBlockChain = BlockChainType.bsc
        if (
          [ETH_CHAINID.ETH_MAIN, ETH_CHAINID.ETH_ROPSTEN].includes(
            network.chainId
          )
        ) {
          reSelectFromBlockChain = BlockChainType.ethereum
        } else if (
          [ETH_CHAINID.HMY_MAIN, ETH_CHAINID.HMY_TEST].includes(network.chainId)
        ) {
          reSelectFromBlockChain = BlockChainType.hmy
        }

        setFromBlockChain(reSelectFromBlockChain)
        setEtherBaseExt(network)

        setLoginStorage({
          blockChain: reSelectFromBlockChain,
          walletType: user.walletType,
        })
      } else {
        setIsVisibleNotSupportNetworkModal(true)
        network &&
          setTriedNotSupportNetwork({
            blockChain: BlockChainType.ethereum,
            name: network.name,
            chainId: network.chainId,
          })
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
    setLoginUser((user) => {
      user.terraWalletConnect?.killSession()
      return initLoginUser
    })
    setStatus(ProcessStatus.Input)
    setEtherBaseExt(undefined)
    setTerraExt(undefined)
    setLoginStorage()
  }

  return { login, logout, getLoginStorage, setLoginStorage }
}

export default useAuth
