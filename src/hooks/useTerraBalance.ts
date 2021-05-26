import { useRecoilValue } from 'recoil'
import _ from 'lodash'

import { UTIL } from 'consts'

import AuthStore from 'store/AuthStore'

import useMantle from './useMantle'
import { BalanceListType } from 'types/asset'

interface Query {
  token: string
  contract: string
  msg: object
}

const stringify = (msg: object): string =>
  JSON.stringify(msg).replace(/"/g, '\\"')

const bankBalanceQuery = `
  query($address: String) {
    BankBalancesAddress(Address: $address) {
      Result {
        Amount
        Denom
      }
    }
  }
`

const alias = ({ token, contract, msg }: Query): string =>
  `${token}: WasmContractsContractAddressStore(
      ContractAddress: "${contract}"
      QueryMsg: "${stringify(msg)}"
    ) {
      Height
      Result
    }`

const getTokenBalanceQuery = (queries: Query[]): string => `
query {
  ${queries.map(alias)}
}
`

const useTerraBalance = (): {
  getTerraBalances: ({
    terraWhiteList,
  }: {
    terraWhiteList: {
      token: string
    }[]
  }) => Promise<BalanceListType>
} => {
  const loginUser = useRecoilValue(AuthStore.loginUser)
  const { fetchQuery } = useMantle()

  const getTerraTokenBalances = async ({
    terraWhiteList,
  }: {
    terraWhiteList: { token: string }[]
  }): Promise<BalanceListType> => {
    const aliasResult = getTokenBalanceQuery(
      Object.values(terraWhiteList).map(({ token }) => ({
        token,
        contract: token,
        msg: { balance: { address: loginUser.address } },
      }))
    )

    const fetchResult: Record<
      string,
      { Height: string; Result: string }
    > = await fetchQuery({
      query: aliasResult,
    })

    if (_.some(fetchResult)) {
      const list: BalanceListType = {}
      _.forEach(fetchResult, (x, key) => {
        if (x) {
          const res = UTIL.jsonTryParse<{ balance: string }>(x.Result)
          if (res) list[key] = res.balance
        }
      })
      return list
    } else {
      return {}
    }
  }

  const getTerraBankBalances = async (): Promise<BalanceListType> => {
    const fetchResult = await fetchQuery({
      query: bankBalanceQuery,
      variables: JSON.stringify({ address: loginUser.address }),
    })
    const resultList: {
      Amount: string
      Denom: string
    }[] = fetchResult?.BankBalancesAddress.Result || []

    if (_.some(resultList)) {
      const list: BalanceListType = {}
      _.forEach(resultList, (x) => {
        list[x.Denom] = x.Amount
      })
      return list
    } else {
      return {}
    }
  }

  const getTerraBalances = async ({
    terraWhiteList,
  }: {
    terraWhiteList: { token: string }[]
  }): Promise<BalanceListType> => {
    const bank = await getTerraBankBalances()
    const token = await getTerraTokenBalances({ terraWhiteList })
    return {
      ...bank,
      ...token,
    }
  }

  return { getTerraBalances }
}

export default useTerraBalance
