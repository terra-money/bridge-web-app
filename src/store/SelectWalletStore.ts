import { atom } from 'recoil'

export enum SelectWalletModalType {
  selectWallet,
  terraExtInstall,
  bscInstall,
  keplrInstall,
}

const isVisibleModalType = atom<SelectWalletModalType | undefined>({
  key: 'isVisibleModalType',
  default: undefined,
})

export default { isVisibleModalType }
