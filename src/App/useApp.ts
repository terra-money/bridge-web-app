import { NETWORK } from 'consts'
import { useSetRecoilState } from 'recoil'
import _ from 'lodash'
import * as Sentry from '@sentry/react'

import ContractStore from 'store/ContractStore'
import { AssetNativeDenomEnum, AssetSymbolEnum, AssetType } from 'types/asset'

import ETH_WHITELIST from 'consts/shuttle_eth.json'
import BSC_WHITELIST from 'consts/shuttle_bsc.json'
import HMY_WHITELIST from 'consts/shuttle_hmy.json'

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

  const getContractAddress = async (): Promise<void> => {
    try {
      const fetchPairJson = await (await fetch(NETWORK.SHUTTLE_PAIRS)).json()
      const formattedPairJson = _.reduce<
        any,
        Record<string, Record<string, string>>
      >(
        fetchPairJson,
        (result, pairs, network) => {
          const val = _.reduce<any, Record<string, string>>(
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
      const terraListJson = await (await fetch(NETWORK.TERRA_WHITELIST)).json()
      const assetList = _.reduce<
        Record<
          string,
          {
            protocol: string
            symbol: string
            name?: string
            token: string
            icon: string
          }
        >,
        Record<string, AssetType[]>
      >(
        terraListJson,
        (result, pairs, network) => {
          const defaultList: AssetType[] = [
            {
              symbol: AssetSymbolEnum.Luna,
              name: 'Luna',
              logoURI: 'https://assets.terra.money/icon/60/Luna.png',
              tokenAddress: AssetNativeDenomEnum.uluna,
            },
            {
              symbol: AssetSymbolEnum.UST,
              name: 'Terra USD',
              logoURI: 'https://assets.terra.money/icon/60/UST.png',
              tokenAddress: AssetNativeDenomEnum.uusd,
            },
            {
              symbol: AssetSymbolEnum.KRT,
              name: 'Terra KRW',
              logoURI: 'https://assets.terra.money/icon/60/KRT.png',
              tokenAddress: AssetNativeDenomEnum.ukrw,
            },
            {
              symbol: AssetSymbolEnum.SDT,
              name: 'Terra SDR',
              logoURI: 'https://assets.terra.money/icon/60/SDT.png',
              tokenAddress: AssetNativeDenomEnum.usdr,
            },
            {
              symbol: AssetSymbolEnum.MNT,
              name: 'Terra MNT',
              logoURI: 'https://assets.terra.money/icon/60/MNT.png',
              tokenAddress: AssetNativeDenomEnum.umnt,
            },
          ]

          const val: AssetType[] = _.map(pairs, (item) => {
            return {
              symbol: item.symbol as AssetSymbolEnum,
              name: item.name || item.protocol,
              logoURI: item.icon,
              tokenAddress: item.token,
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

      //const ethListJson = await (await fetch(NETWORK.ETH_WHITELIST)).json()
      const ethListJson = ETH_WHITELIST
      setEthWhiteList(ethListJson)

      //const bscListJson = await(await fetch(NETWORK.BSC_WHITELIST)).json()
      const bscListJson = BSC_WHITELIST
      setBscWhiteList(bscListJson)

      //const hmyListJson = await (await fetch(NETWORK.HMY_WHITELIST)).json()
      const hmyListJson = HMY_WHITELIST
      setHmyWhiteList(hmyListJson)
    } catch (error) {
      Sentry.captureException(error)
    }
  }

  const initApp = async (): Promise<void> => {
    return getContractAddress()
  }

  return {
    initApp,
  }
}

export default useApp
