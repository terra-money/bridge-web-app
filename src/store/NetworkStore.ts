import { atom, selector } from 'recoil'
import { Network as EtherNetwork } from '@ethersproject/networks'
import AuthStore from './AuthStore'
import { ExtTerraNetwork, LocalTerraNetwork } from 'types/network'
import { NETWORK } from 'consts'

const terraExt = atom<ExtTerraNetwork | undefined>({
  key: 'terraExt',
  default: undefined,
})

const terraLocal = atom<LocalTerraNetwork>({
  key: 'terraLocal',
  default: NETWORK.terra_networks.mainnet,
})

const etherBaseExt = atom<EtherNetwork | undefined>({
  key: 'etherBaseExt',
  default: undefined,
})

const isTestnet = selector<boolean>({
  key: 'isTestnet',
  get: ({ get }) => {
    const isLoggedIn = get(AuthStore.isLoggedIn)
    if (isLoggedIn) {
      const loginUser = get(AuthStore.loginUser)
      if (loginUser.blockChain === 'terra') {
        const _terraExt = get(terraExt)
        return _terraExt?.name !== 'mainnet'
      }
      const _etherBaseExt = get(etherBaseExt)

      if (loginUser.blockChain === 'ethereum') {
        return _etherBaseExt?.name !== 'homestead'
      } else {
        return _etherBaseExt?.chainId !== 56
      }
    }
    return false
  },
})

export default {
  terraExt,
  terraLocal,
  etherBaseExt,
  isTestnet,
}
