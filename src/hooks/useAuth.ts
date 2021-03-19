import { useRecoilState, useSetRecoilState } from 'recoil'
import { Network } from '@ethersproject/networks'

import { NETWORK } from 'consts'

import SendStore from 'store/SendStore'
import AuthStore, { initLoginUser } from 'store/AuthStore'
import NetworkStore from 'store/NetworkStore'

import terraService from 'services/terraService'

import { User } from 'types/auth'
import { BlockChainType } from 'types/network'

const useAuth = (): {
  login: ({ user }: { user: User }) => Promise<void>
  logout: () => void
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
    }
    // both ethereum , bsc are ethereum base blockchain
    else {
      const network = await user.provider?.getNetwork()
      const isValidEtherNetwork = checkIsValidEtherNetwork({ network })
      if (network && isValidEtherNetwork) {
        const { ETH_CHAINID } = NETWORK

        setFromBlockChain(
          [ETH_CHAINID.ETH_MAIN, ETH_CHAINID.ETH_ROPSTEN].includes(
            network.chainId
          )
            ? BlockChainType.ethereum
            : BlockChainType.bsc
        )
        setEtherBaseExt(network)
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

  const logout = (): void => {
    setLoginUser(initLoginUser)
    setEtherBaseExt(undefined)
    setTerraExt(undefined)
  }

  return { login, logout }
}

export default useAuth
