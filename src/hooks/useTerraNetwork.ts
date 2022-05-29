import { useMemo } from 'react'

import { LocalTerraNetwork, TerraAssetsPathEnum, TerraNetworkEnum } from 'types'
import useTerraAssets from './useTerraAssets'

export const defaultTerraNetworks: Record<TerraNetworkEnum, LocalTerraNetwork> =
  {
    mainnet: {
      name: TerraNetworkEnum.mainnet,
      chainID: 'phoenix-1',
      lcd: 'https://phoenix-lcd.terra.dev',
      fcd: 'https://phoenix-fcd.terra.dev',
      mantle: 'https://phoenix-hive.terra.dev/graphql',
      walletconnectID: 1,
    },
    testnet: {
      name: TerraNetworkEnum.testnet,
      chainID: 'pisco-1',
      lcd: 'https://pisco-lcd.terra.dev',
      fcd: 'https://pisco-fcd.terra.dev',
      mantle: 'https://pisco-mantle.terra.dev',
      walletconnectID: 0,
    },
  }

const useTerraNetwork = (): {
  getTerraNetworkByChainID: (chainID: string) => LocalTerraNetwork | undefined
  getTerraNetworkByWalletconnectID: (
    id: number
  ) => LocalTerraNetwork | undefined
} => {
  const { data } = useTerraAssets<Record<TerraNetworkEnum, LocalTerraNetwork>>({
    path: TerraAssetsPathEnum.chains,
  })

  const networkList: LocalTerraNetwork[] = useMemo(() => {
    const getOptions = (net: TerraNetworkEnum): LocalTerraNetwork => {
      return { ...defaultTerraNetworks[net], ...data?.[net] }
    }

    return [
      getOptions(TerraNetworkEnum.mainnet),
      getOptions(TerraNetworkEnum.testnet),
    ]
  }, [data])

  const getTerraNetworkByChainID = (
    chainID: string
  ): LocalTerraNetwork | undefined => {
    return networkList.find((x) => x.chainID === chainID)
  }

  const getTerraNetworkByWalletconnectID = (
    id: number
  ): LocalTerraNetwork | undefined => {
    return networkList.find((x) => x.walletconnectID === id)
  }

  return {
    getTerraNetworkByChainID,
    getTerraNetworkByWalletconnectID,
  }
}

export default useTerraNetwork
