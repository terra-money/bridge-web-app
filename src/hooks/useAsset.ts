import { useRecoilValue, useSetRecoilState } from 'recoil'
import _ from 'lodash'
import BigNumber from 'bignumber.js'

import { ASSET, NETWORK } from 'consts'
import AuthStore from 'store/AuthStore'
import SendStore from 'store/SendStore'

import { AssetType, WhiteListType, BalanceListType } from 'types/asset'
import { BlockChainType, BridgeType, isIbcNetwork } from 'types/network'

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
  const bridgeUsed = useRecoilValue(SendStore.bridgeUsed)

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
          const tokenAddress =
            fromBlockChain === BlockChainType.terra
              ? asset.terraToken
              : whiteList[asset.terraToken]
          return whiteList[asset.terraToken] || fromBlockChain === toBlockChain
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
    return _.reduce<AssetType, AssetType[]>(
      assetList,
      (arr, asset) => {
        return whiteList[asset.terraToken] || fromBlockChain === toBlockChain
          ? [
              ...arr,
              {
                ...asset,
              },
            ]
          : arr
      },
      []
    )
  }

  const getAssetList = async (): Promise<void> => {
    let balanceList: BalanceListType = {}
    if (isLoggedIn && whiteList) {
      if (fromBlockChain === BlockChainType.terra) {
        let balanceWhiteList = _.map(terraWhiteList, (token) => ({ token }))

        balanceWhiteList = balanceWhiteList.filter(({ token }): boolean => {
          return (
            token.startsWith('terra1') &&
            (!!whiteList[token] || fromBlockChain === toBlockChain)
          )
        })

        balanceList = await getTerraBalances(balanceWhiteList)
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

    const pairList = _.map(fromList, (item) => {
      const disabled =
        _.isEmpty(whiteList[item.terraToken]) && fromBlockChain !== toBlockChain
      return {
        ...item,
        disabled,
      }
    }).filter((item) => !item.disabled)

    setAssetList(pairList)
  }

  const formatBalance = (balance: string | BigNumber): string => {
    if (balance) {
      const bnBalance =
        typeof balance === 'string' ? new BigNumber(balance) : balance

      return fromBlockChain === BlockChainType.terra ||
        bridgeUsed === BridgeType.ibc ||
        bridgeUsed === BridgeType.axelar ||
        bridgeUsed === BridgeType.wormhole
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
