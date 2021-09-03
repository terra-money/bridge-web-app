import { useSetRecoilState } from 'recoil'
import _ from 'lodash'
import * as Sentry from '@sentry/react'

import SHUTTLE_PAIRS from 'assets/cw20/pairs.json'

import TERRA_WHITELIST from 'assets/cw20/tokens.json'
import ETH_WHITELIST from 'assets/shuttle/eth.json'
import BSC_WHITELIST from 'assets/shuttle/bsc.json'
import HMY_WHITELIST from 'assets/shuttle/hmy.json'

import ContractStore from 'store/ContractStore'
import { AssetNativeDenomEnum, AssetSymbolEnum, AssetType } from 'types/asset'

import LunaPng from 'assets/60/Luna.png'
import USTPng from 'assets/60/UST.png'
import KRTPng from 'assets/60/KRT.png'
import SDTPng from 'assets/60/SDT.png'
import MNTPng from 'assets/60/MNT.png'

const defaultList: AssetType[] = [
  {
    symbol: AssetSymbolEnum.Luna,
    name: 'Luna',
    logoURI: LunaPng,
    terraToken: AssetNativeDenomEnum.uluna,
  },
  {
    symbol: AssetSymbolEnum.UST,
    name: 'Terra USD',
    logoURI: USTPng,
    terraToken: AssetNativeDenomEnum.uusd,
  },
  {
    symbol: AssetSymbolEnum.KRT,
    name: 'Terra KRW',
    logoURI: KRTPng,
    terraToken: AssetNativeDenomEnum.ukrw,
  },
  {
    symbol: AssetSymbolEnum.SDT,
    name: 'Terra SDR',
    logoURI: SDTPng,
    terraToken: AssetNativeDenomEnum.usdr,
  },
  {
    symbol: AssetSymbolEnum.MNT,
    name: 'Terra MNT',
    logoURI: MNTPng,
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

  const getContractAddress = async (): Promise<void> => {
    try {
      // const fetchPairJson: ShuttlePairType = await (
      //   await fetch(NETWORK.SHUTTLE_PAIRS)
      // ).json()
      console.log(SHUTTLE_PAIRS)

      const fetchPairJson: ShuttlePairType = SHUTTLE_PAIRS
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

      // const terraListJson: TerraWhiteListType = await (
      //   await fetch(NETWORK.TERRA_WHITELIST)
      // ).json()

      const terraListJson = TERRA_WHITELIST
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

      //const ethListJson = await (await fetch(NETWORK.ETH_WHITELIST)).json()
      const ethListJson = ETH_WHITELIST
      setEthWhiteList(ethListJson)

      //const bscListJson = await (await fetch(NETWORK.BSC_WHITELIST)).json()
      const bscListJson = BSC_WHITELIST
      setBscWhiteList(bscListJson)

      //const hmyListJson = await (await fetch(NETWORK.HMY_WHITELIST)).json()
      const hmyListJson = HMY_WHITELIST
      setHmyWhiteList(hmyListJson)
    } catch (error) {
      debugger
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
