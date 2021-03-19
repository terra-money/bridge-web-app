import { atom } from 'recoil'

export enum SelectWalletModalType {
  etherBaseModal,
  terraExtInstall,
  bscInstall,
}

const isVisibleModalType = atom<SelectWalletModalType | undefined>({
  key: 'isVisibleModalType',
  default: undefined,
})

export default { isVisibleModalType }
