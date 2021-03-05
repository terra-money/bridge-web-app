import { useSetRecoilState } from 'recoil'
import SelectWalletStore from 'store/SelectWalletStore'

const useSelectWallet = (): {
  openModal: () => void
  closeModal: () => void
} => {
  const setIsVisibleModal = useSetRecoilState(SelectWalletStore.isVisibleModal)

  const openModal = (): void => {
    setIsVisibleModal(true)
  }
  const closeModal = (): void => {
    setIsVisibleModal(false)
  }
  return {
    openModal,
    closeModal,
  }
}

export default useSelectWallet
