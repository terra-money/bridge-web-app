import { useRecoilValue } from 'recoil'
import AuthStore from 'store/AuthStore'
import { ethers } from 'ethers'
import abi from 'consts/abi.json'
import { BlockChainType } from 'types/network'

const useEtherBaseContract = (): {
  getEtherBaseContract: ({
    token,
  }: {
    token: string
  }) => ethers.Contract | undefined
} => {
  const loginUser = useRecoilValue(AuthStore.loginUser)

  const getEtherBaseContract = ({
    token,
  }: {
    token: string
  }): ethers.Contract | undefined => {
    if (loginUser.blockChain !== BlockChainType.terra) {
      try {
        // if token is empty, error occurs
        return token
          ? new ethers.Contract(token, abi, loginUser.provider)
          : undefined
      } catch {}
      return
    }
  }
  return {
    getEtherBaseContract,
  }
}

export default useEtherBaseContract
