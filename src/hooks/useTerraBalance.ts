import { useRecoilValue } from 'recoil'
import _ from 'lodash'

import AuthStore from 'store/AuthStore'

import useMantle from './useMantle'
import { BalanceListType } from 'types/asset'
import NetworkStore from 'store/NetworkStore'
import axios from 'axios'

interface Query {
  token: string
  contract: string
  address: string
}

const alias = ({ token, contract, address }: Query): string =>
  `${token}: contractQuery(
  contractAddress: "${contract}"
  query: {
    balance: { address: "${address}" }
  }
)`

const getTokenBalanceQuery = (queries: Query[]): string => `
{
  wasm {
    ${queries.map(alias)}
  }
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
            address: loginUser.address,
          }))
        )

        const fetchResult: { wasm: Record<string, { balance: string }> } =
          await fetchQuery({
            query: aliasResult,
          })

        return fetchResult.wasm
      })
    )

    // flatten to map
    const fetchResultFlattened = fetchResult.reduce((acc, cur) => {
      return { ...acc, ...cur }
    }, {} as typeof fetchResult[0])

    if (_.some(fetchResultFlattened)) {
      const list: BalanceListType = {}
      _.forEach(fetchResultFlattened, (x, key) => {
        if (x) list[key] = x.balance
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
