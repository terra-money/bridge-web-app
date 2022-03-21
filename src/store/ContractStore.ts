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

const initOnlyEthWhiteList = atom<
  Record<'mainnet' | 'testnet', WhiteListType> | undefined
>({
  key: 'initOnlyEthWhiteList',
  default: undefined,
})

const initOnlyBscWhiteList = atom<
  Record<'mainnet' | 'testnet', WhiteListType> | undefined
>({
  key: 'initOnlyBscWhiteList',
  default: undefined,
})

const initOnlyHmyWhiteList = atom<
  Record<'mainnet' | 'testnet', WhiteListType> | undefined
>({
  key: 'initOnlyHmyWhiteList',
  default: undefined,
})

const initOnlyIbcWhiteList = atom<
  Record<'mainnet' | 'testnet', WhiteListType> | undefined
>({
  key: 'initOnlyIbcWhiteList',
  default: undefined,
})

const initOnlyOsmoWhiteList = atom<
  Record<'mainnet' | 'testnet', WhiteListType> | undefined
>({
  key: 'initOnlyOsmoWhiteList',
  default: undefined,
})

const initOnlyScrtWhiteList = atom<
  Record<'mainnet' | 'testnet', WhiteListType> | undefined
>({
  key: 'initOnlyScrtWhiteList',
  default: undefined,
})

const initOnlyInjWhiteList = atom<
  Record<'mainnet' | 'testnet', WhiteListType> | undefined
>({
  key: 'initOnlyInjWhiteList',
  default: undefined,
})

const initOnlyCosmosWhiteList = atom<
  Record<'mainnet' | 'testnet', WhiteListType> | undefined
>({
  key: 'initOnlyCosmosWhiteList',
  default: undefined,
})

const initOnlyAvalancheWhiteList = atom<
  Record<'mainnet' | 'testnet', WhiteListType> | undefined
>({
  key: 'initOnlyAvalanceWhiteList',
  default: undefined,
})

const initOnlyFantomWhiteList = atom<
  Record<'mainnet' | 'testnet', WhiteListType> | undefined
>({
  key: 'initOnlyFantomWhiteList',
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

// if empty, service will block from start
const ethWhiteList = selector<WhiteListType>({
  key: 'ethWhiteList',
  get: ({ get }) => {
    const isTestnet = get(NetworkStore.isTestnet)
    const fetchedData = get(initOnlyEthWhiteList)
    const ethVaultTokenList: Record<
      string,
      {
        ether: string
        vault: string
      }
    > = NETWORK.ETH_VAULT_TOKEN_LIST[isTestnet ? 'testnet' : 'mainnet']

    const result = fetchedData
      ? _.clone(fetchedData[isTestnet ? 'testnet' : 'mainnet'])
      : {}

    if (_.some(ethVaultTokenList)) {
      _.forEach(ethVaultTokenList, (val, key) => {
        result[key] = val.ether
      })
    }

    return result
  },
})

// if empty, service will block from start
const bscWhiteList = selector<WhiteListType>({
  key: 'bscWhiteList',
  get: ({ get }) => {
    const isTestnet = get(NetworkStore.isTestnet)
    const fetchedData = get(initOnlyBscWhiteList)
    if (fetchedData) {
      return fetchedData[isTestnet ? 'testnet' : 'mainnet']
    }
    return {}
  },
})

// if empty, service will block from start
const osmoWhiteList = selector<WhiteListType>({
  key: 'osmoWhiteList',
  get: ({ get }) => {
    const isTestnet = get(NetworkStore.isTestnet)
    const fetchedData = get(initOnlyOsmoWhiteList)
    if (fetchedData) {
      return fetchedData[isTestnet ? 'testnet' : 'mainnet']
    }
    return {}
  },
})

// if empty, service will block from start
const scrtWhiteList = selector<WhiteListType>({
  key: 'scrtWhiteList',
  get: ({ get }) => {
    const isTestnet = get(NetworkStore.isTestnet)
    const fetchedData = get(initOnlyScrtWhiteList)
    if (fetchedData) {
      return fetchedData[isTestnet ? 'testnet' : 'mainnet']
    }
    return {}
  },
})

// if empty, service will block from start
const injWhiteList = selector<WhiteListType>({
  key: 'injWhiteList',
  get: ({ get }) => {
    const isTestnet = get(NetworkStore.isTestnet)
    const fetchedData = get(initOnlyInjWhiteList)
    if (fetchedData) {
      return fetchedData[isTestnet ? 'testnet' : 'mainnet']
    }
    return {}
  },
})

// if empty, service will block from start
const cosmosWhiteList = selector<WhiteListType>({
  key: 'cosmosWhiteList',
  get: ({ get }) => {
    const isTestnet = get(NetworkStore.isTestnet)
    const fetchedData = get(initOnlyCosmosWhiteList)
    if (fetchedData) {
      return fetchedData[isTestnet ? 'testnet' : 'mainnet']
    }
    return {}
  },
})

// if empty, service will block from start
const avalancheWhiteList = selector<WhiteListType>({
  key: 'avalancheWhiteList',
  get: ({ get }) => {
    const isTestnet = get(NetworkStore.isTestnet)
    const fetchedData = get(initOnlyAvalancheWhiteList)
    if (fetchedData) {
      return fetchedData[isTestnet ? 'testnet' : 'mainnet']
    }
    return {}
  },
})

// if empty, service will block from start
const fantomWhiteList = selector<WhiteListType>({
  key: 'fantomWhiteList',
  get: ({ get }) => {
    const isTestnet = get(NetworkStore.isTestnet)
    const fetchedData = get(initOnlyFantomWhiteList)
    if (fetchedData) {
      return fetchedData[isTestnet ? 'testnet' : 'mainnet']
    }
    return {}
  },
})

// if empty, service will block from start
const hmyWhiteList = selector<WhiteListType>({
  key: 'hmyWhiteList',
  get: ({ get }) => {
    const isTestnet = get(NetworkStore.isTestnet)
    const fetchedData = get(initOnlyHmyWhiteList)
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
    const ethWhiteList = get(initOnlyEthWhiteList) || {
      mainnet: {},
      testnet: {},
    }
    const bscWhiteList = get(initOnlyBscWhiteList) || {
      mainnet: {},
      testnet: {},
    }
    const hmyWhiteList = get(initOnlyHmyWhiteList) || {
      mainnet: {},
      testnet: {},
    }
    const osmoWhiteList = get(initOnlyOsmoWhiteList) || {
      mainnet: {},
      testnet: {},
    }
    const scrtWhiteList = get(initOnlyScrtWhiteList) || {
      mainnet: {},
      testnet: {},
    }
    const injWhiteList = get(initOnlyInjWhiteList) || {
      mainnet: {},
      testnet: {},
    }
    const cosmosWhiteList = get(initOnlyCosmosWhiteList) || {
      mainnet: {},
      testnet: {},
    }
    const avalancheWhiteList = get(initOnlyAvalancheWhiteList) || {
      mainnet: {},
      testnet: {},
    }
    const fantomWhiteList = get(initOnlyFantomWhiteList) || {
      mainnet: {},
      testnet: {},
    }

    return [
      ..._.flatMap(terraWhiteList['mainnet']),
      ..._.flatMap(terraWhiteList['testnet']),
      ..._.flatMap(ethWhiteList['mainnet']),
      ..._.flatMap(ethWhiteList['testnet']),
      ..._.flatMap(bscWhiteList['mainnet']),
      ..._.flatMap(bscWhiteList['testnet']),
      ..._.flatMap(hmyWhiteList['mainnet']),
      ..._.flatMap(hmyWhiteList['testnet']),
      ..._.flatMap(osmoWhiteList['mainnet']),
      ..._.flatMap(osmoWhiteList['testnet']),
      ..._.flatMap(scrtWhiteList['mainnet']),
      ..._.flatMap(scrtWhiteList['testnet']),
      ..._.flatMap(injWhiteList['mainnet']),
      ..._.flatMap(injWhiteList['testnet']),
      ..._.flatMap(cosmosWhiteList['mainnet']),
      ..._.flatMap(cosmosWhiteList['testnet']),
      ..._.flatMap(avalancheWhiteList['mainnet']),
      ..._.flatMap(avalancheWhiteList['testnet']),
      ..._.flatMap(fantomWhiteList['mainnet']),
      ..._.flatMap(fantomWhiteList['testnet']),
    ]
  },
})

export default {
  initOnlyAssetList,
  initOnlyShuttlePairs,
  initOnlyTerraWhiteList,
  initOnlyEthWhiteList,
  initOnlyBscWhiteList,
  initOnlyHmyWhiteList,
  initOnlyIbcWhiteList,
  initOnlyOsmoWhiteList,
  initOnlyScrtWhiteList,
  initOnlyInjWhiteList,
  initOnlyCosmosWhiteList,
  initOnlyAvalancheWhiteList,
  initOnlyFantomWhiteList,
  assetList,
  shuttleUusdPairs,
  terraWhiteList,
  ethWhiteList,
  bscWhiteList,
  hmyWhiteList,
  osmoWhiteList,
  scrtWhiteList,
  injWhiteList,
  cosmosWhiteList,
  avalancheWhiteList,
  fantomWhiteList,
  etherVaultTokenList,
  allTokenAddress,
}
