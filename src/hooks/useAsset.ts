import { useRecoilValue, useSetRecoilState } from 'recoil'
import _ from 'lodash'
import BigNumber from 'bignumber.js'

import { ASSET, NETWORK } from 'consts'
import AuthStore from 'store/AuthStore'
import NetworkStore from 'store/NetworkStore'
import SendStore from 'store/SendStore'
import ShuttleStore from 'store/ShuttleStore'

import { AssetType, WhiteListType, BalanceListType } from 'types/asset'
import { BlockChainType } from 'types/network'

import bsc_mainnet from '../whitelist/bsc_mainnet.json'
import bsc_testnet from '../whitelist/bsc_testnet.json'
import eth_homestead from '../whitelist/eth_homestead.json'
import eth_ropsten from '../whitelist/eth_ropsten.json'
import useTerraBalance from './useTerraBalance'
import useEtherBaseBalance from './useEtherBaseBalance'

const useAsset = (): {
  getAssetList: () => Promise<void>
  formatBalace: (balance: string | BigNumber) => string
} => {
  const isLoggedIn = useRecoilValue(AuthStore.isLoggedIn)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)

  const terraLocal = useRecoilValue(NetworkStore.terraLocal)
  const etherBaseExt = useRecoilValue(NetworkStore.etherBaseExt)
  const setTerraPair = useSetRecoilState(
    ShuttleStore.mAssetTerraPairContractAddress
  )
  const setAssetList = useSetRecoilState(SendStore.loginUserAssetList)

  const { getTerraBalances } = useTerraBalance()
  const { getEtherBalances } = useEtherBaseBalance()

  const jsonWhiteListParser = (json: any): WhiteListType => {
    const list: WhiteListType = {}
    _.forEach(json, (item: { symbol: string; token: string }) => {
      list[item.symbol] = item.token
    })
    return list
  }

  const getTerraWhiteList = async ({
    contract,
  }: {
    contract: string
  }): Promise<WhiteListType> => {
    const response = await fetch(contract)
    const json: {
      /** Token addresses */
      whitelist: any
    } = await response.json()

    setTerraPair(
      _.map(json.whitelist, (x) => ({
        tokenAddress: x.token,
        pairContractAddress: x.pair,
      }))
    )

    return {
      ...ASSET.nativeDenoms,
      ...jsonWhiteListParser(json.whitelist),
    }
  }

  const getEtherWhiteList = async ({
    name,
  }: {
    name: string
  }): Promise<WhiteListType> =>
    jsonWhiteListParser(name === 'homestead' ? eth_homestead : eth_ropsten)

  const getBscWhiteList = async ({
    chainId,
  }: {
    chainId: number
  }): Promise<WhiteListType> =>
    jsonWhiteListParser(
      chainId === NETWORK.ETH_CHAINID.BSC_MAIN ? bsc_mainnet : bsc_testnet
    )

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
      return _.map(assetList, (asset) => {
        const tokenAddress = whiteList[asset.symbol]
        return {
          ...asset,
          tokenAddress,
          balance: balanceList[tokenAddress],
        }
      })
    }

    return assetList
  }
  const getAssetList = async (): Promise<void> => {
    const assetList = ASSET.assetList
    let whiteList: WhiteListType = {}
    let balanceList: BalanceListType = {}
    if (isLoggedIn) {
      if (fromBlockChain === 'terra' && terraLocal) {
        whiteList = await getTerraWhiteList({
          contract: terraLocal.contract,
        })
        balanceList = await getTerraBalances({
          terraWhiteList: _.map(whiteList, (token) => ({ token })),
        })
      } else if (fromBlockChain === 'ethereum' && etherBaseExt) {
        whiteList = await getEtherWhiteList(etherBaseExt)
        balanceList = await getEtherBalances({ whiteList })
      } else if (fromBlockChain === 'bsc' && etherBaseExt) {
        whiteList = await getBscWhiteList(etherBaseExt)
        balanceList = await getEtherBalances({ whiteList })
      }
    }

    const list = setBalanceToAssetList({ assetList, whiteList, balanceList })
    setAssetList(list)
  }

  const formatBalace = (balance: string | BigNumber): string => {
    if (balance) {
      const bnBalance =
        typeof balance === 'string' ? new BigNumber(balance) : balance

      return fromBlockChain === BlockChainType.terra
        ? bnBalance.div(ASSET.TERRA_DECIMAL).toString()
        : bnBalance
            .div(ASSET.ETHER_BASE_DECIMAL / ASSET.TERRA_DECIMAL)
            .integerValue(BigNumber.ROUND_DOWN)
            .div(ASSET.TERRA_DECIMAL)
            .toString()
    }

    return ''
  }

  return {
    getAssetList,
    formatBalace,
  }
}

export default useAsset
