import { useRecoilValue } from 'recoil'
import _ from 'lodash'

import AuthStore from 'store/AuthStore'

import { WhiteListType, BalanceListType } from 'types/asset'

import axios from 'axios'

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
    // const publicKey = new web3.PublicKey(
    //   userAddress
    // );
    // const walletTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(
    //     publicKey,
    // );
    // const solana = new web3.Connection(web3.clusterApiUrl('mainnet-beta'),'confirmed',);
    // return (await solana.getBalance(publicKey)).toString();
    // return (await solana.getTokenAccountBalance(walletTokenAccount.address));
    const response = await axios({
      url: `https://api.mainnet-beta.solana.com`,
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      data: {
        jsonrpc: '2.0',
        id: 1,
        method: 'getTokenAccountsByOwner',
        params: [
          userAddress,
          {
            mint: token,
          },
          {
            encoding: 'jsonParsed',
          },
        ],
      },
    })
    if (
      Array.isArray(response?.data?.result?.value) &&
      response?.data?.result?.value?.length > 0 &&
      response?.data?.result?.value[0]?.account?.data?.parsed?.info?.tokenAmount
        ?.amount > 0
    ) {
      return (
        Number(
          response?.data?.result?.value[0]?.account?.data?.parsed?.info
            ?.tokenAmount?.amount
        ) / 1000000000
      ).toString()
    } else {
      return '0'
    }
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
