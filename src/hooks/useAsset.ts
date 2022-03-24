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
  isAxelarNetwork,
  allowedCoins,
  IbcNetwork,
} from 'types/network'

import useTerraBalance from './useTerraBalance'
import useEtherBaseBalance from './useEtherBaseBalance'
import useKeplrBalance from './useKeplrBalance'
import ContractStore from 'store/ContractStore'
import useWhiteList from './useWhiteList'

const useAsset = (): {
  getAssetList: () => Promise<void>
  formatBalance: (balance: string | BigNumber) => string
} => {
  const isLoggedIn = useRecoilValue(AuthStore.isLoggedIn)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)
  const toBlockChain = useRecoilValue(SendStore.toBlockChain)

  const assetList = useRecoilValue(ContractStore.assetList)
  const terraWhiteList = useRecoilValue(ContractStore.terraWhiteList)

  const whiteList = useWhiteList()

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
    let balanceList: BalanceListType = {}
    if (isLoggedIn) {
      if (fromBlockChain === BlockChainType.terra) {
        let balanceWhiteList = _.map(terraWhiteList, (token) => ({ token }))

        balanceWhiteList = balanceWhiteList.filter(
          ({ token }): boolean =>
            token.startsWith('terra1') && !!whiteList[token]
        )
        balanceList = await getTerraBalances({
          terraWhiteList: balanceWhiteList,
        })
      } else if (NETWORK.isEtherBaseBlockChain(fromBlockChain)) {
        balanceList = await getEtherBalances({ whiteList })
      } else if (isIbcNetwork(fromBlockChain)) {
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
      const pairList = _.map(fromList, (item) => {
        console.log(whiteList)
        const disabled = _.isEmpty(whiteList[item.terraToken])
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
    } else if (
      fromBlockChain === BlockChainType.terra &&
      isAxelarNetwork(toBlockChain)
    ) {
      const allowed = allowedCoins[BlockChainType.axelar] as string[]
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

      return fromBlockChain === BlockChainType.terra ||
        isIbcNetwork(fromBlockChain)
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
