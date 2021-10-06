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

    return [
      ..._.flatMap(terraWhiteList['mainnet']),
      ..._.flatMap(terraWhiteList['testnet']),
      ..._.flatMap(ethWhiteList['mainnet']),
      ..._.flatMap(ethWhiteList['testnet']),
      ..._.flatMap(bscWhiteList['mainnet']),
      ..._.flatMap(bscWhiteList['testnet']),
      ..._.flatMap(hmyWhiteList['mainnet']),
      ..._.flatMap(hmyWhiteList['testnet']),
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

  assetList,
  shuttleUusdPairs,
  terraWhiteList,
  ethWhiteList,
  bscWhiteList,
  hmyWhiteList,
  etherVaultTokenList,

  allTokenAddress,
}
