import { atom } from 'recoil'

const isVisibleModal = atom<boolean>({
  key: 'isVisibleModal',
  default: false,
})

export default { isVisibleModal }
