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

type TerraIbcListType = Record<
  'mainnet' | 'testnet',
  Record<
    string,
    {
      denom: string
      path: string
      base_denom: string
      symbol: string
      name: string
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
  const setIbcWhiteList = useSetRecoilState(ContractStore.initOnlyIbcWhiteList)
  const setOsmoWhiteList = useSetRecoilState(
    ContractStore.initOnlyOsmoWhiteList
  )
  const setScrtWhiteList = useSetRecoilState(
    ContractStore.initOnlyScrtWhiteList
  )
  const setInjWhiteList = useSetRecoilState(ContractStore.initOnlyInjWhiteList)
  const setCosmosWhiteList = useSetRecoilState(
    ContractStore.initOnlyCosmosWhiteList
  )
  const setAvalancheWhiteList = useSetRecoilState(
    ContractStore.initOnlyAvalancheWhiteList
  )
  const setFantomWhiteList = useSetRecoilState(
    ContractStore.initOnlyFantomWhiteList
  )

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
      const ibcListJson: TerraIbcListType = await fetchAssets(
        TerraAssetsPathEnum.ibc_tokens
      )

      const tokenList = _.reduce<
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
            // TODO remove hard coding - disable bETH
            .filter(({ terraToken }) => {
              return (
                terraToken !== 'terra1dzhzukyezv0etz22ud940z7adyv7xgcjkahuun' &&
                terraToken !== 'terra19mkj9nec6e3y5754tlnuz4vem7lzh4n0lc2s3l'
              )
            })

          result[network] = defaultList.concat(val)
          return result
        },
        {}
      )

      const assetList = _.reduce<TerraIbcListType, Record<string, AssetType[]>>(
        ibcListJson,
        (result, pairs, network) => {
          const val: AssetType[] = _.map(pairs, (item) => {
            return {
              symbol: item.symbol as AssetSymbolEnum,
              name: item.name,
              logoURI: item.icon,
              terraToken: item.denom,
            }
          })
          result[network] = tokenList[network].concat(val)
          return result
        },
        {}
      )
      setAssetList(assetList)

      const formattedTerraListJson = _.reduce<
        any,
        Record<string, Record<string, string>>
      >(
        assetList,
        (result, pairs, network) => {
          const val = _.reduce<{ terraToken: string }, Record<string, string>>(
            pairs,
            (obj, { terraToken }) => {
              obj[terraToken] = terraToken
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

      const osmoListJson = await fetchAssets(TerraAssetsPathEnum.osmo_tokens)
      setOsmoWhiteList(osmoListJson)

      const scrtListJson = await fetchAssets(TerraAssetsPathEnum.scrt_tokens)
      setScrtWhiteList(scrtListJson)

      const injListJson = await fetchAssets(TerraAssetsPathEnum.inj_tokens)
      setInjWhiteList(injListJson)

      const cosmosListJson = await fetchAssets(
        TerraAssetsPathEnum.cosmos_tokens
      )
      setCosmosWhiteList(cosmosListJson)

      const avalancheListJson = await fetchAssets(
        TerraAssetsPathEnum.avalanche_tokens
      )
      setAvalancheWhiteList(avalancheListJson)

      const fantomListJson = await fetchAssets(
        TerraAssetsPathEnum.fantom_tokens
      )
      setFantomWhiteList(fantomListJson)

      const ibcTokensJson = await fetchAssets(TerraAssetsPathEnum.ibc_tokens)
      setIbcWhiteList(ibcTokensJson)
    } catch {}
  }

  const initApp = async (): Promise<void> => {
    return getContractAddress()
  }

  return {
    initApp,
  }
}

export default useApp
