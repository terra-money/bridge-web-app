import { atom, selector } from 'recoil'
import { Network as EtherNetwork } from '@ethersproject/networks'

import { NETWORK } from 'consts'
import {
  BlockChainType,
  ExtTerraNetwork,
  LocalSecretNetwork,
  LocalTerraNetwork,
} from 'types/network'
import AuthStore from './AuthStore'
import SendStore from './SendStore'

const terraExt = atom<ExtTerraNetwork | undefined>({
  key: 'terraExt',
  default: undefined,
})

const terraLocal = atom<LocalTerraNetwork>({
  key: 'terraLocal',
  default: NETWORK.terra_networks.mainnet,
})

const keplrLocal = atom<LocalSecretNetwork | undefined>({
  key: 'keplrLocal',
  default: undefined,
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
      } else if (fromBlockChain === BlockChainType.secret) {
        const _keplrLocal = get(keplrLocal)
        return _keplrLocal?.chainID.includes('holodeck') === true
      }
      const _etherBaseExt = get(etherBaseExt)

      if (fromBlockChain === BlockChainType.ethereum) {
        return _etherBaseExt?.name !== 'homestead'
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

const triedNotSupportNetwork = atom<EtherNetwork | undefined>({
  key: 'triedNotSupportNetwork',
  default: undefined,
})

export default {
  terraExt,
  terraLocal,
  keplrLocal,
  etherBaseExt,
  isTestnet,
  isVisibleNotSupportNetworkModal,
  triedNotSupportNetwork,
}
