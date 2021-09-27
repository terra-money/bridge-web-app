import { atom, selector } from 'recoil'
import { Network as EtherNetwork } from '@ethersproject/networks'

import { NETWORK } from 'consts'
import {
  BlockChainType,
  ExtTerraNetwork,
  LocalTerraNetwork,
} from 'types/network'
import AuthStore from './AuthStore'
import SendStore from './SendStore'
import { defaultTerraNetworks } from 'hooks/useTerraNetwork'

const terraExt = atom<ExtTerraNetwork | undefined>({
  key: 'terraExt',
  default: undefined,
})

const terraLocal = atom<LocalTerraNetwork>({
  key: 'terraLocal',
  default: defaultTerraNetworks.mainnet,
})

const etherBaseExt = atom<EtherNetwork | undefined>({
  key: 'etherBaseExt',
  default: undefined,
})

const isTestnet = selector<boolean>({
  key: 'isTestnet',
  get: ({ get }) => {
    const isLoggedIn = get(AuthStore.isLoggedIn)
    const fromBlockChain = get(SendStore.fromBlockChain)
    if (isLoggedIn) {
      if (fromBlockChain === BlockChainType.terra) {
        const _terraExt = get(terraExt)

        return _terraExt?.name !== 'mainnet'
      }
      const _etherBaseExt = get(etherBaseExt)

      if (fromBlockChain === BlockChainType.ethereum) {
        return _etherBaseExt?.name !== 'homestead'
      } else if (fromBlockChain === BlockChainType.hmy) {
        return _etherBaseExt?.chainId !== NETWORK.ETH_CHAINID.HMY_MAIN
      } else {
        return _etherBaseExt?.chainId !== NETWORK.ETH_CHAINID.BSC_MAIN
      }
    }
    return false
  },
})

const isVisibleNotSupportNetworkModal = atom<boolean>({
  key: 'isVisibleNotSupportNetworkModal',
  default: false,
})

const triedNotSupportNetwork = atom<
  | {
      blockChain: BlockChainType
      name: string
      chainId: string | number
    }
  | undefined
>({
  key: 'triedNotSupportNetwork',
  default: undefined,
})

export default {
  terraExt,
  terraLocal,
  etherBaseExt,
  isTestnet,
  isVisibleNotSupportNetworkModal,
  triedNotSupportNetwork,
}
