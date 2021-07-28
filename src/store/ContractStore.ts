import { atom, selector } from 'recoil'
import { AssetType, WhiteListType } from 'types/asset'
import NetworkStore from './NetworkStore'

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
    if (fetchedData) {
      return fetchedData[isTestnet ? 'testnet' : 'mainnet']
    }
    return {}
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
}
