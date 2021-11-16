import { useMemo } from 'react'

import { LocalTerraNetwork, TerraAssetsPathEnum, TerraNetworkEnum } from 'types'
import useTerraAssets from './useTerraAssets'

export const defaultTerraNetworks: Record<TerraNetworkEnum, LocalTerraNetwork> =
  {
    mainnet: {
      name: TerraNetworkEnum.mainnet,
      chainID: 'columbus-5',
      lcd: 'https://lcd.terra.dev',
      fcd: 'https://fcd.terra.dev',
      mantle: 'https://mantle.terra.dev',
      walletconnectID: 1,
      shuttle: {
        ethereum: 'terra13yxhrk08qvdf5zdc9ss5mwsg5sf7zva9xrgwgc',
        bsc: 'terra1g6llg3zed35nd3mh9zx6n64tfw3z67w2c48tn2',
        harmony: 'terra1rtn03a9l3qsc0a9verxwj00afs93mlm0yr7chk',
      },
    },
    testnet: {
      name: TerraNetworkEnum.testnet,
      chainID: 'bombay-12',
      lcd: 'https://bombay-lcd.terra.dev',
      fcd: 'https://bombay-fcd.terra.dev',
      mantle: 'https://bombay-mantle.terra.dev',
      walletconnectID: 0,
      shuttle: {
        ethereum: 'terra1skc56hrrg92zj8xxj6lyjlt2l2m8q8sf832sqm',
        bsc: 'terra1paav7jul3dzwzv78j0k59glmevttnkfgmgzv2r',
        harmony: 'terra1nrmn0klu4st0qdg4w0wcktnsu5lwfneqlgw5w9',
      },
    },
  }

const useTerraNetwork = (): {
  getTerraNetworkByName: (
    name: TerraNetworkEnum
  ) => LocalTerraNetwork | undefined
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

  const getTerraNetworkByName = (
    name: TerraNetworkEnum
  ): LocalTerraNetwork | undefined => {
    return networkList.find((x) => x.name === name)
  }

  const getTerraNetworkByWalletconnectID = (
    id: number
  ): LocalTerraNetwork | undefined => {
    return networkList.find((x) => x.walletconnectID === id)
  }

  return {
    getTerraNetworkByName,
    getTerraNetworkByWalletconnectID,
  }
}

export default useTerraNetwork
