import axios from 'axios'
import { NETWORK } from 'consts'
import { useMemo } from 'react'
import { useQuery } from 'react-query'

import {
  LocalTerraNetwork,
  TerraNetworkNameEnum as TerraNetworkEnum,
} from 'types'
import QueryKeysEnum from 'types/queryKeys'

export const defaultTerraNetworks: Record<TerraNetworkEnum, LocalTerraNetwork> =
  {
    mainnet: {
      name: TerraNetworkEnum.mainnet,
      chainID: 'columbus-4',
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
      chainID: 'tequila-0004',
      lcd: 'https://tequila-lcd.terra.dev',
      fcd: 'https://tequila-fcd.terra.dev',
      mantle: 'https://tequila-mantle.terra.dev',
      walletconnectID: 0,
      shuttle: {
        ethereum: 'terra10a29fyas9768pw8mewdrar3kzr07jz8f3n73t3',
        bsc: 'terra1paav7jul3dzwzv78j0k59glmevttnkfgmgzv2r',
        harmony: 'terra1nrmn0klu4st0qdg4w0wcktnsu5lwfneqlgw5w9',
      },
    },
    bombay: {
      name: TerraNetworkEnum.bombay,
      chainID: 'bombay-11',
      lcd: 'https://bombay-lcd.terra.dev',
      fcd: 'https://bombay-fcd.terra.dev',
      mantle: 'https://bombay-mantle.terra.dev',
      walletconnectID: 2,
      shuttle: {
        ethereum: 'terra10a29fyas9768pw8mewdrar3kzr07jz8f3n73t3',
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
  const { data } = useQuery<Record<TerraNetworkEnum, LocalTerraNetwork>>(
    [QueryKeysEnum.terraAssetsJson, NETWORK.TERRA_CHAINS],
    async () => {
      try {
        const { data } = await axios.get(NETWORK.TERRA_CHAINS)
        return data
      } catch {}
    }
  )

  const networkList: LocalTerraNetwork[] = useMemo(() => {
    const getOptions = (net: TerraNetworkEnum): LocalTerraNetwork => {
      return { ...defaultTerraNetworks[net], ...data?.[net] }
    }

    return [
      getOptions(TerraNetworkEnum.mainnet),
      getOptions(TerraNetworkEnum.testnet),
      getOptions(TerraNetworkEnum.bombay),
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
