import { useRecoilValue, useSetRecoilState } from 'recoil'
import SelectWalletStore, {
  SelectWalletModalType,
} from 'store/SelectWalletStore'
import SendStore from 'store/SendStore'
import { BlockChainType } from 'types/network'
import useAuth from './useAuth'

import terraService from 'services/terraService'
import { WalletEnum } from 'types/wallet'

const useSelectWallet = (): {
  open: () => void
  closeModal: () => void
} => {
  const setIsVisibleModalType = useSetRecoilState(
    SelectWalletStore.isVisibleModalType
  )
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)
  const { login } = useAuth()

  const open = async (): Promise<void> => {
    if (fromBlockChain === BlockChainType.terra) {
      const terraExtInstalled = terraService.checkInstalled()
      if (terraExtInstalled) {
        const result = await terraService.connect()
        await login({
          user: {
            address: result.address,
            walletType: WalletEnum.TerraStation,
          },
        })
      } else {
        setIsVisibleModalType(SelectWalletModalType.terraExtInstall)
      }
    } else {
      setIsVisibleModalType(SelectWalletModalType.etherBaseModal)
    }
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
