import { useRecoilValue } from 'recoil'
import _ from 'lodash'

import AuthStore from 'store/AuthStore'

import { WhiteListType, BalanceListType } from 'types/asset'

// import axios from 'axios'

import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  Token,
} from '@solana/spl-token'
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'

const useSolanaBalance = (): {
  getSolanaBalances: ({
    whiteList,
  }: {
    whiteList: WhiteListType
  }) => Promise<BalanceListType>
} => {
  const loginUser = useRecoilValue(AuthStore.loginUser)

  const getSolanaBalance = async ({
    token,
    userAddress,
  }: {
    token: string
    userAddress: string
  }): Promise<string> => {
    const connection = new Connection(
      clusterApiUrl('mainnet-beta'),
      'confirmed'
    )

    const assTokenKey = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      new PublicKey(token),
      new PublicKey(userAddress)
    )

    const balance = assTokenKey
      ? await connection.getTokenAccountBalance(assTokenKey)
      : 0

    const amount = balance != 0 && balance?.value?.amount
    return amount || '0'
  }

  const getSolanaBalances = async ({
    whiteList,
  }: {
    whiteList: WhiteListType
  }): Promise<BalanceListType> => {
    const userAddress = loginUser.address
    const list: BalanceListType = {}
    await Promise.all(
      _.map(whiteList, async (token) => {
        const balance = await getSolanaBalance({
          token,
          userAddress,
        })
        list[token] = balance
      })
    )
    return list
  }
  return {
    getSolanaBalances,
  }
}

export default useSolanaBalance
