import { useSetRecoilState } from 'recoil'

import SelectWalletStore, {
  SelectWalletModalType,
} from 'store/SelectWalletStore'

const useSelectWallet = (): {
  open: () => void
  closeModal: () => void
} => {
  const setIsVisibleModalType = useSetRecoilState(
    SelectWalletStore.isVisibleModalType
  )

  const open = async (): Promise<void> => {
    setIsVisibleModalType(SelectWalletModalType.selectWallet)
  }

  const closeModal = (): void => {
    setIsVisibleModalType(undefined)
  }

  return {
    open,
    closeModal,
  }
}

export default useSelectWallet
