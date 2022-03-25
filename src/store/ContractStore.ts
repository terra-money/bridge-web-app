import { NETWORK } from 'consts'
import { atom, selector } from 'recoil'
import _ from 'lodash'

import { AssetType, WhiteListType } from 'types/asset'
import NetworkStore from './NetworkStore'
import BigNumber from 'bignumber.js'

export type ShuttleUusdPairType = Record<
  string, //token address
  string // pair contract address
>

const initOnlyAssetList = atom<
  Record<'mainnet' | 'testnet', AssetType[]> | undefined
>({
  key: 'initOnlyAssetList',
  default: undefined,
})

const initOnlyShuttlePairs = atom<
  Record<'mainnet' | 'testnet', ShuttleUusdPairType> | undefined
>({
  key: 'initOnlyShuttlePairs',
  default: undefined,
})

const initOnlyTerraWhiteList = atom<
  Record<'mainnet' | 'testnet', WhiteListType> | undefined
>({
  key: 'initOnlyTerraWhiteList',
  default: undefined,
})

const assetList = selector<AssetType[]>({
  key: 'assetList',
  get: ({ get }) => {
    const isTestnet = get(NetworkStore.isTestnet)
    const fetchedData = get(initOnlyAssetList)
    if (fetchedData) {
      return fetchedData[isTestnet ? 'testnet' : 'mainnet']
    }
    return []
  },
})
// if empty, service will block from start
const shuttleUusdPairs = selector<ShuttleUusdPairType>({
  key: 'shuttleUusdPairs',
  get: ({ get }) => {
    const isTestnet = get(NetworkStore.isTestnet)
    const fetchedData = get(initOnlyShuttlePairs)
    if (fetchedData) {
      return fetchedData[isTestnet ? 'testnet' : 'mainnet']
    }
    return {}
  },
})

// if empty, service will block from start
const terraWhiteList = selector<WhiteListType>({
  key: 'terraWhiteList',
  get: ({ get }) => {
    const isTestnet = get(NetworkStore.isTestnet)
    const fetchedData = get(initOnlyTerraWhiteList)
    if (fetchedData) {
      return fetchedData[isTestnet ? 'testnet' : 'mainnet']
    }
    return {}
  },
})

const etherVaultTokenList = selector<
  Record<
    string,
    { ether: string; vault: string; getPricePerUst: () => Promise<BigNumber> }
  >
>({
  key: 'etherVaultTokenList',
  get: ({ get }) => {
    const isTestnet = get(NetworkStore.isTestnet)
    const fetchedData = NETWORK.ETH_VAULT_TOKEN_LIST
    if (fetchedData) {
      return fetchedData[isTestnet ? 'testnet' : 'mainnet']
    }
    return {}
  },
})

const allTokenAddress = selector<string[]>({
  key: 'allTokenAddress',
  get: ({ get }) => {
    const terraWhiteList = get(initOnlyTerraWhiteList) || {
      mainnet: {},
      testnet: {},
    }

    return [
      ..._.flatMap(terraWhiteList['mainnet']),
      ..._.flatMap(terraWhiteList['testnet']),
    ]
  },
})

export default {
  initOnlyAssetList,
  initOnlyShuttlePairs,
  initOnlyTerraWhiteList,
  assetList,
  shuttleUusdPairs,
  terraWhiteList,
  etherVaultTokenList,
  allTokenAddress,
}
