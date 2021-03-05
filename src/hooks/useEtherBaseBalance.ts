import { useRecoilValue } from 'recoil'
import _ from 'lodash'

import AuthStore from 'store/AuthStore'

import { WhiteListType, BalanceListType } from 'types/asset'

import useEtherBaseContract from './useEtherBaseContract'

const useEtherBaseBalance = (): {
  getEtherBalances: ({
    whiteList,
  }: {
    whiteList: WhiteListType
  }) => Promise<BalanceListType>
} => {
  const { getEtherBaseContract } = useEtherBaseContract()
  const loginUser = useRecoilValue(AuthStore.loginUser)
  const getEtherBalance = async ({
    token,
    userAddress,
  }: {
    token: string
    userAddress: string
  }): Promise<string> => {
    const contract = getEtherBaseContract({ token })

    if (contract) {
      const fn = contract['balanceOf']
      const balance = await fn?.(userAddress)
      return balance?.toString() ?? '0'
    }
    return ''
  }

  const getEtherBalances = async ({
    whiteList,
  }: {
    whiteList: WhiteListType
  }): Promise<BalanceListType> => {
    const userAddress = loginUser.address
    const list: BalanceListType = {}
    await Promise.all(
      _.map(whiteList, async (token) => {
        const balance = await getEtherBalance({
          token,
          userAddress,
        })
        list[token] = balance
      })
    )
    return list
  }
  return {
    getEtherBalances,
  }
}

export default useEtherBaseBalance
