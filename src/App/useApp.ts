import { NETWORK } from 'consts'
import { useSetRecoilState } from 'recoil'
import _ from 'lodash'

import ContractStore from 'store/ContractStore'
import {
  AssetNativeDenomEnum,
  AssetSymbolEnum,
  AssetType,
  TerraAssetsPathEnum,
} from 'types'

const defaultList: AssetType[] = [
  {
    symbol: AssetSymbolEnum.Luna,
    name: 'Luna',
    logoURI: 'https://assets.terra.money/icon/60/Luna.png',
    terraToken: AssetNativeDenomEnum.uluna,
  },
  {
    symbol: AssetSymbolEnum.UST,
    name: 'Terra USD',
    logoURI: 'https://assets.terra.money/icon/60/UST.png',
    terraToken: AssetNativeDenomEnum.uusd,
  },
  {
    symbol: AssetSymbolEnum.KRT,
    name: 'Terra KRW',
    logoURI: 'https://assets.terra.money/icon/60/KRT.png',
    terraToken: AssetNativeDenomEnum.ukrw,
  },
  {
    symbol: AssetSymbolEnum.SDT,
    name: 'Terra SDR',
    logoURI: 'https://assets.terra.money/icon/60/SDT.png',
    terraToken: AssetNativeDenomEnum.usdr,
  },
  {
    symbol: AssetSymbolEnum.MNT,
    name: 'Terra MNT',
    logoURI: 'https://assets.terra.money/icon/60/MNT.png',
    terraToken: AssetNativeDenomEnum.umnt,
  },
]

type ShuttlePairType = Record<'mainnet' | 'testnet', Record<string, string[]>>

type TerraWhiteListType = Record<
  'mainnet' | 'testnet',
  Record<
    string,
    {
      protocol: string
      symbol: string
      name?: string
      token: string
      icon: string
    }
  >
>

const useApp = (): {
  initApp: () => Promise<void>
} => {
  const setAssetList = useSetRecoilState(ContractStore.initOnlyAssetList)
  const setShuttlePairs = useSetRecoilState(ContractStore.initOnlyShuttlePairs)
  const setTerraWhiteList = useSetRecoilState(
    ContractStore.initOnlyTerraWhiteList
  )
  const setEthWhiteList = useSetRecoilState(ContractStore.initOnlyEthWhiteList)
  const setBscWhiteList = useSetRecoilState(ContractStore.initOnlyBscWhiteList)
  const setHmyWhiteList = useSetRecoilState(ContractStore.initOnlyHmyWhiteList)

  const fetchAssets = async (path: TerraAssetsPathEnum): Promise<any> => {
    return (await fetch(`${NETWORK.TERRA_ASSETS_URL}${path}`)).json()
  }

  const getContractAddress = async (): Promise<void> => {
    try {
      const fetchPairJson: ShuttlePairType = await fetchAssets(
        TerraAssetsPathEnum.cw20_pairs
      )
      const formattedPairJson = _.reduce<
        ShuttlePairType,
        Record<string, Record<string, string>>
      >(
        fetchPairJson,
        (result, pairs, network) => {
          const val = _.reduce<
            Record<string, string[]>,
            Record<string, string>
          >(
            pairs,
            (obj, arr, tokenAddress) => {
              obj[arr[1]] = tokenAddress
              return obj
            },
            {}
          )
          result[network] = val
          return result
        },
        {}
      )
      setShuttlePairs(formattedPairJson)

      const terraListJson: TerraWhiteListType = await fetchAssets(
        TerraAssetsPathEnum.cw20_tokens
      )
      const assetList = _.reduce<
        TerraWhiteListType,
        Record<string, AssetType[]>
      >(
        terraListJson,
        (result, pairs, network) => {
          const val: AssetType[] = _.map(pairs, (item) => {
            return {
              symbol: item.symbol as AssetSymbolEnum,
              name: item.name || item.protocol,
              logoURI: item.icon,
              terraToken: item.token,
            }
          })
          result[network] = defaultList.concat(val)
          return result
        },
        {}
      )

      setAssetList(assetList)

      const formattedTerraListJson = _.reduce<
        any,
        Record<string, Record<string, string>>
      >(
        terraListJson,
        (result, pairs, network) => {
          const val = _.reduce<{ token: string }, Record<string, string>>(
            pairs,
            (obj, { token }) => {
              obj[token] = token
              return obj
            },
            {
              [AssetNativeDenomEnum.uluna]: AssetNativeDenomEnum.uluna,
              [AssetNativeDenomEnum.uusd]: AssetNativeDenomEnum.uusd,
              [AssetNativeDenomEnum.ukrw]: AssetNativeDenomEnum.ukrw,
              [AssetNativeDenomEnum.usdr]: AssetNativeDenomEnum.usdr,
              [AssetNativeDenomEnum.umnt]: AssetNativeDenomEnum.umnt,
            }
          )
          result[network] = val
          return result
        },
        {}
      )
      setTerraWhiteList(formattedTerraListJson)

      const ethListJson = await fetchAssets(TerraAssetsPathEnum.shuttle_eth)
      setEthWhiteList(ethListJson)

      const bscListJson = await fetchAssets(TerraAssetsPathEnum.shuttle_bsc)
      setBscWhiteList(bscListJson)

      const hmyListJson = await fetchAssets(TerraAssetsPathEnum.shuttle_hmy)
      setHmyWhiteList(hmyListJson)
    } catch { }
  }

  const initApp = async (): Promise<void> => {
    return getContractAddress()
  }

  return {
    initApp,
  }
}

export default useApp
