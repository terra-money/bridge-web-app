import { useSetRecoilState } from 'recoil'

import { NETWORK } from 'consts'

import AuthStore, { initLoginUser } from 'store/AuthStore'
import NetworkStore from 'store/NetworkStore'
import terraService from 'services/terraService'
import { User } from 'types/auth'

const useAuth = (): {
  login: ({ user }: { user: User }) => Promise<void>
  logout: () => void
} => {
  const setLoginUser = useSetRecoilState(AuthStore.loginUser)
  const setEtherBaseExt = useSetRecoilState(NetworkStore.etherBaseExt)
  const setTerraExt = useSetRecoilState(NetworkStore.terraExt)
  const setTerraLocal = useSetRecoilState(NetworkStore.terraLocal)

  const login = async ({ user }: { user: User }): Promise<void> => {
    if (user.blockChain === 'terra') {
      const extNet = await terraService.info()
      setTerraExt(extNet)
      const localNetwork = NETWORK.terra_networks[extNet.name]
      setTerraLocal(localNetwork)
    }
    // both ethereum , bsc are ethereum base blockchain
    else {
      const network = await user.provider.getNetwork()
      setEtherBaseExt(network)
    }
    // DON'T MOVE
    // set user have to be after set network info
    setLoginUser(user)
    return
  }

  const logout = (): void => {
    setLoginUser(initLoginUser)
    setEtherBaseExt(undefined)
    setTerraExt(undefined)
  }

  return { login, logout }
}

export default useAuth
