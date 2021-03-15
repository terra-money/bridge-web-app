import { useRecoilValue } from 'recoil'
import { ethers } from 'ethers'

import abi from 'consts/abi.json'

import { BlockChainType } from 'types/network'

import AuthStore from 'store/AuthStore'
import SendStore from 'store/SendStore'

const useEtherBaseContract = (): {
  getEtherBaseContract: ({
    token,
  }: {
    token: string
  }) => ethers.Contract | undefined
} => {
  const loginUser = useRecoilValue(AuthStore.loginUser)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)

  const getEtherBaseContract = ({
    token,
  }: {
    token: string
  }): ethers.Contract | undefined => {
    if (fromBlockChain !== BlockChainType.terra) {
      try {
        // if token is empty, error occurs
        return token
          ? new ethers.Contract(token, abi, loginUser.provider)
          : undefined
      } catch {}
    }
  }
  return {
    getEtherBaseContract,
  }
}

export default useEtherBaseContract
