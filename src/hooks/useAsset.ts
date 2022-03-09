import { useRecoilValue, useSetRecoilState } from 'recoil'
import _ from 'lodash'
import BigNumber from 'bignumber.js'

import { ASSET, NETWORK } from 'consts'
import AuthStore from 'store/AuthStore'
import SendStore from 'store/SendStore'

import { AssetType, WhiteListType, BalanceListType } from 'types/asset'
import {
  BlockChainType,
  isIbcNetwork,
  allowedCoins,
  IbcNetwork,
} from 'types/network'

import useTerraBalance from './useTerraBalance'
import useEtherBaseBalance from './useEtherBaseBalance'
import useKeplrBalance from './useKeplrBalance'
import ContractStore from 'store/ContractStore'

const useAsset = (): {
  getAssetList: () => Promise<void>
  formatBalance: (balance: string | BigNumber) => string
} => {
  const isLoggedIn = useRecoilValue(AuthStore.isLoggedIn)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)
  const toBlockChain = useRecoilValue(SendStore.toBlockChain)

  const assetList = useRecoilValue(ContractStore.assetList)
  const terraWhiteList = useRecoilValue(ContractStore.terraWhiteList)
  const ethWhiteList = useRecoilValue(ContractStore.ethWhiteList)
  const bscWhiteList = useRecoilValue(ContractStore.bscWhiteList)
  const hmyWhiteList = useRecoilValue(ContractStore.hmyWhiteList)
  const osmoWhiteList = useRecoilValue(ContractStore.osmoWhiteList)
  const scrtWhiteList = useRecoilValue(ContractStore.scrtWhiteList)
  const injWhiteList = useRecoilValue(ContractStore.injWhiteList)

  const setAssetList = useSetRecoilState(SendStore.loginUserAssetList)

  const { getTerraBalances } = useTerraBalance()
  const { getEtherBalances } = useEtherBaseBalance()
  const { getKeplrBalances } = useKeplrBalance()

  const setBalanceToAssetList = ({
    assetList,
    whiteList,
    balanceList,
  }: {
    assetList: AssetType[]
    whiteList: WhiteListType
    balanceList: BalanceListType
  }): AssetType[] => {
    if (_.some(balanceList)) {
      return _.reduce<AssetType, AssetType[]>(
        assetList,
        (arr, asset) => {
          const tokenAddress = whiteList[asset.terraToken]
          return tokenAddress
            ? [
                ...arr,
                {
                  ...asset,
                  balance: balanceList[tokenAddress],
                },
              ]
            : arr
        },
        []
      )
    }
    return assetList
  }

  const getAssetList = async (): Promise<void> => {
    let whiteList: WhiteListType = {}
    let balanceList: BalanceListType = {}
    if (isLoggedIn) {
      if (fromBlockChain === BlockChainType.terra) {
        whiteList = terraWhiteList
        let balanceWhiteList = _.map(whiteList, (token) => ({ token }))
        switch (toBlockChain) {
          case BlockChainType.terra:
            balanceWhiteList = balanceWhiteList.filter(
              ({ token }): boolean =>
                token.startsWith('terra1')
            )
            break
          case BlockChainType.ethereum:
            balanceWhiteList = balanceWhiteList.filter(
              ({ token }): boolean =>
                token.startsWith('terra1') && !!ethWhiteList[token]
            )
            break
          case BlockChainType.bsc:
            balanceWhiteList = balanceWhiteList.filter(
              ({ token }): boolean =>
                token.startsWith('terra1') && !!bscWhiteList[token]
            )
            break
          case BlockChainType.hmy:
            balanceWhiteList = balanceWhiteList.filter(
              ({ token }): boolean =>
                token.startsWith('terra1') && !!hmyWhiteList[token]
            )
            break
          default:
            // ibc chain
            if(isIbcNetwork(toBlockChain)) {
              balanceWhiteList = balanceWhiteList.filter(
                ({ token }): boolean =>
                  token.startsWith('terra1') &&
                  allowedCoins[toBlockChain as IbcNetwork].includes(token)
              )
            // axelar
            } else {
              balanceWhiteList = balanceWhiteList.filter(
                ({ token }): boolean =>
                  token.startsWith('terra1') &&
                  allowedCoins[BlockChainType.axelar].includes(token)
              )
              console.log(allowedCoins[BlockChainType.axelar])
            }
        }
        balanceList = await getTerraBalances({
          terraWhiteList: balanceWhiteList,
        })
      } else if (NETWORK.isEtherBaseBlockChain(fromBlockChain)) {
        switch(fromBlockChain){
          case BlockChainType.ethereum:
            whiteList = ethWhiteList
            break
          case BlockChainType.bsc:
            whiteList = bscWhiteList
            break
          case BlockChainType.hmy:
            whiteList = hmyWhiteList
            break
        }
        balanceList = await getEtherBalances({ whiteList })
      } else if (isIbcNetwork(fromBlockChain)) {
        switch(fromBlockChain){
          case BlockChainType.osmo:
            whiteList = osmoWhiteList
            break
          case BlockChainType.scrt:
            whiteList = scrtWhiteList
            break
          case BlockChainType.inj:
            whiteList = injWhiteList
            break
        }
        balanceList = await getKeplrBalances({ whiteList })
      }
    }

    const fromList = setBalanceToAssetList({
      assetList,
      whiteList,
      balanceList,
    })

    if (
      fromBlockChain !== toBlockChain &&
      NETWORK.isEtherBaseBlockChain(toBlockChain)
    ) {
      let toWhiteList = bscWhiteList
      if (toBlockChain === BlockChainType.ethereum) {
        toWhiteList = ethWhiteList
      } else if (toBlockChain === BlockChainType.hmy) {
        toWhiteList = hmyWhiteList
      }

      const pairList = _.map(fromList, (item) => {
        const disabled = _.isEmpty(toWhiteList[item.terraToken])
        return {
          ...item,
          disabled,
        }
      }).filter((item) => !item.disabled)
      setAssetList(pairList)
    } else if (
      fromBlockChain === BlockChainType.terra &&
      isIbcNetwork(toBlockChain)
    ) {
      const allowed = allowedCoins[toBlockChain as IbcNetwork] as string[]
      const filteredList = fromList.filter((item) =>
        allowed.includes(item.terraToken)
      )
      setAssetList(filteredList)
    } else {
      setAssetList(fromList)
    }
  }

  const formatBalance = (balance: string | BigNumber): string => {
    if (balance) {
      const bnBalance =
        typeof balance === 'string' ? new BigNumber(balance) : balance

      return fromBlockChain === BlockChainType.terra || isIbcNetwork(fromBlockChain)
        ? bnBalance.div(ASSET.TERRA_DECIMAL).dp(6).toString(10)
        : bnBalance
            .div(ASSET.ETHER_BASE_DECIMAL / ASSET.TERRA_DECIMAL)
            .integerValue(BigNumber.ROUND_DOWN)
            .div(ASSET.TERRA_DECIMAL)
            .dp(6)
            .toString(10)
    }

    return ''
  }

  return {
    getAssetList,
    formatBalance,
  }
}

export default useAsset
