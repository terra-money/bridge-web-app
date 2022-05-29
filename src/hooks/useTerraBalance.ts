import { useRecoilValue } from 'recoil'
import _ from 'lodash'

import { UTIL } from 'consts'

import AuthStore from 'store/AuthStore'

import useMantle from './useMantle'
import { BalanceListType } from 'types/asset'
import NetworkStore from 'store/NetworkStore'
import axios from 'axios'

interface Query {
  token: string
  contract: string
  msg: object
}

const stringify = (msg: object): string =>
  JSON.stringify(msg).replace(/"/g, '\\"')

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
  getTerraBalances: (
    terraWhiteList: {
      token: string
    }[]
  ) => Promise<BalanceListType>
} => {
  const loginUser = useRecoilValue(AuthStore.loginUser)
  const localNetwork = useRecoilValue(NetworkStore.terraLocal)
  const { fetchQuery } = useMantle()

  // TODO: fix CW20 query for hive
  const getTerraTokenBalances = async (
    terraWhiteList: { token: string }[]
  ): Promise<BalanceListType> => {
    // use to be 1 giant gql query for all tokens,
    // however it is likely to go timeout.
    //
    // prevent timeout by chunking it by 1 tokens, and
    // make parallel requests
    const terraWhiteListInChunks = _.chunk(terraWhiteList, 10)

    // concurrency = len(terraWhiteList) / 10
    const fetchResult = await Promise.all(
      terraWhiteListInChunks.map(async (whitelist) => {
        const aliasResult = getTokenBalanceQuery(
          Object.values(whitelist).map(({ token }) => ({
            token,
            contract: token,
            msg: { balance: { address: loginUser.address } },
          }))
        )

        const fetchResult: Record<string, { Height: string; Result: string }> =
          await fetchQuery({
            query: aliasResult,
          })

        return fetchResult
      })
    )

    // flatten to map
    const fetchResultFlattened = fetchResult.reduce((acc, cur) => {
      return { ...acc, ...cur }
    }, {} as typeof fetchResult[0])

    if (_.some(fetchResultFlattened)) {
      const list: BalanceListType = {}
      _.forEach(fetchResultFlattened, (x, key) => {
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
    const {
      data: { balances },
    } = await axios.get(
      `${localNetwork.lcd}/cosmos/bank/v1beta1/balances/${loginUser.address}`
    )

    if (_.some(balances)) {
      const list: BalanceListType = {}
      _.forEach(balances, (x) => {
        list[x.denom] = x.amount
      })
      return list
    } else {
      return {}
    }
  }

  const getTerraBalances = async (
    terraWhiteList: { token: string }[]
  ): Promise<BalanceListType> => {
    const bank = await getTerraBankBalances()
    const token = await getTerraTokenBalances(terraWhiteList)
    return {
      ...bank,
      ...token,
    }
  }

  return { getTerraBalances }
}

export default useTerraBalance
