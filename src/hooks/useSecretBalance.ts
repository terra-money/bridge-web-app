import { useRecoilValue } from 'recoil'
import _ from 'lodash'
import {} from 'secretjs'

import AuthStore from 'store/AuthStore'

import { WhiteListType, BalanceListType } from 'types/asset'

import NetworkStore from 'store/NetworkStore'

const useSecretBalance = (): {
  getSecretBalances: ({
    whiteList,
  }: {
    whiteList: WhiteListType
  }) => Promise<BalanceListType>
} => {
  const loginUser = useRecoilValue(AuthStore.loginUser)
  const keplrLocal = useRecoilValue(NetworkStore.keplrLocal)

  const getSecretBalance = async ({
    chainId,
    token,
    userAddress,
  }: {
    chainId: string
    token: string
    userAddress: string
  }): Promise<string> => {
    try {
      const secretViewingKey = await window.keplr.getSecret20ViewingKey(
        chainId,
        token
      )
      const result = await loginUser.signingCosmWasmClient?.queryContractSmart(
        token,
        {
          balance: { address: userAddress, key: secretViewingKey },
        }
      )
      return result.balance?.amount
    } catch {
      return '0'
    }
  }

  const getSecretBalances = async ({
    whiteList,
  }: {
    whiteList: WhiteListType
  }): Promise<BalanceListType> => {
    const userAddress = loginUser.address
    const chainId = keplrLocal?.chainID!
    const list: BalanceListType = {}

    await Promise.all(
      _.map(whiteList, async (token) => {
        const balance = await getSecretBalance({
          chainId,
          token,
          userAddress,
        })
        list[token] = balance
      })
    )
    return list
  }
  return {
    getSecretBalances,
  }
}

export default useSecretBalance
