import { useRecoilValue } from 'recoil'
import _ from 'lodash'

import AuthStore from 'store/AuthStore'

import { WhiteListType, BalanceListType } from 'types/asset'

const useKeplrBalance = (): {
  getKeplrBalances: ({
    whiteList,
  }: {
    whiteList: WhiteListType
  }) => Promise<BalanceListType>
} => {
  const loginUser = useRecoilValue(AuthStore.loginUser)

  const getKeplrBalance = async ({
    token,
    userAddress,
  }: {
    token: string
    userAddress: string
  }): Promise<string> => {
    return await (
      (await loginUser.signer?.getBalance(userAddress, token)) || { amount: 0 }
    ).amount.toString()
  }

  const getKeplrBalances = async ({
    whiteList,
  }: {
    whiteList: WhiteListType
  }): Promise<BalanceListType> => {
    const userAddress = loginUser.address
    const list: BalanceListType = {}
    await Promise.all(
      _.map(whiteList, async (token) => {
        const balance = await getKeplrBalance({
          token,
          userAddress,
        })
        list[token] = balance
      })
    )
    return list
  }
  return {
    getKeplrBalances,
  }
}

export default useKeplrBalance
