import { atom, selector } from 'recoil'
import _ from 'lodash'

import { User } from 'types/auth'
import { WalletEnum } from 'types/wallet'

import NetworkStore from './NetworkStore'

export const initLoginUser: User = {
  address: '',
  walletType: WalletEnum.TerraExtension,
}

const loginUser = atom<User>({
  key: 'loginUser',
  default: initLoginUser,
  dangerouslyAllowMutability: true,
})

const isLoggedIn = selector({
  key: 'isLoggedIn',
  get: ({ get }) => {
    const user = get(loginUser)
    const etherBaseExt = get(NetworkStore.etherBaseExt)
    const terraExt = get(NetworkStore.terraExt)

    return (
      _.some(user && user.address) &&
      _.some(etherBaseExt || terraExt || user.terraWalletConnect)
    )
  },
})

export default {
  loginUser,
  isLoggedIn,
}
