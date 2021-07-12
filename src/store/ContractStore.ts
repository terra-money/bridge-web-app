import { atom, selector } from 'recoil'
import { AssetSymbolEnum, AssetType, WhiteListType } from 'types/asset'
import NetworkStore from './NetworkStore'

export type ShuttleUusdPairType = Record<
  string, //token address
  string // pair contract address
>

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

const assetList = atom<AssetType[]>({
  key: 'assetList',
  default: [
    {
      symbol: AssetSymbolEnum.Luna,
      name: 'Luna',
      logoURI: 'https://assets.terra.money/icon/60/Luna.png',
      tokenAddress: '',
    },
    {
      symbol: AssetSymbolEnum.UST,
      name: 'Terra USD',
      logoURI: 'https://assets.terra.money/icon/60/UST.png',
      tokenAddress: '',
    },
    {
      symbol: AssetSymbolEnum.KRT,
      name: 'Terra KRW',
      logoURI: 'https://assets.terra.money/icon/60/KRT.png',
      tokenAddress: '',
    },
    {
      symbol: AssetSymbolEnum.SDT,
      name: 'Terra SDR',
      logoURI: 'https://assets.terra.money/icon/60/SDT.png',
      tokenAddress: '',
    },
    {
      symbol: AssetSymbolEnum.MNT,
      name: 'Terra MNT',
      logoURI: 'https://assets.terra.money/icon/60/MNT.png',
      tokenAddress: '',
    },
  ],
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
