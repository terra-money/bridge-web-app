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
    symbol: 'LUNC',
    name: 'Luna Classic',
    logoURI: `${NETWORK.TERRA_ASSETS_URL}/icon/svg/Luna.svg`,
    terraToken: AssetNativeDenomEnum.uluna,
  },
  {
    symbol: AssetSymbolEnum.UST,
    name: 'Terra Classic USD',
    logoURI: `${NETWORK.TERRA_ASSETS_URL}/icon/60/UST.png`,
    terraToken: AssetNativeDenomEnum.uusd,
  },
  {
    symbol: AssetSymbolEnum.KRT,
    name: 'Terra Classic KRW',
    logoURI: `${NETWORK.TERRA_ASSETS_URL}/icon/60/KRT.png`,
    terraToken: AssetNativeDenomEnum.ukrw,
  },
  {
    symbol: AssetSymbolEnum.SDT,
    name: 'Terra Classic SDR',
    logoURI: `${NETWORK.TERRA_ASSETS_URL}/icon/60/SDT.png`,
    terraToken: AssetNativeDenomEnum.usdr,
  },
  {
    symbol: AssetSymbolEnum.MNT,
    name: 'Terra Classic MNT',
    logoURI: `${NETWORK.TERRA_ASSETS_URL}/icon/60/MNT.png`,
    terraToken: AssetNativeDenomEnum.umnt,
  },
]

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
  const setTerraWhiteList = useSetRecoilState(
    ContractStore.initOnlyTerraWhiteList
  )
  const fetchAssets = async (path: TerraAssetsPathEnum): Promise<any> => {
    return (await fetch(`${NETWORK.TERRA_ASSETS_URL}/${path}`)).json()
  }

  const getContractAddress = async (): Promise<void> => {
    try {
      const terraList: any = await fetchAssets(TerraAssetsPathEnum.cw20_tokens)
      const ibcList: any = await fetchAssets(TerraAssetsPathEnum.ibc_tokens)

      const terraListJson: TerraWhiteListType = {
        mainnet: terraList.classic,
        testnet: {},
      }
      const ibcListJson: TerraIbcListType = {
        mainnet: ibcList.classic,
        testnet: {},
      }

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
