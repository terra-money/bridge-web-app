import axios from 'axios'
import { NETWORK } from 'consts'
import { QueryObserverResult, useQuery } from 'react-query'
import { TerraAssetsPathEnum } from 'types'

import QueryKeysEnum from 'types/queryKeys'

const useTerraAssets = <T>({
  path,
}: {
  path: TerraAssetsPathEnum
}): QueryObserverResult<T, unknown> => {
  const result = useQuery<T>(
    [QueryKeysEnum.terraAssetsJson, path],
    async () => {
      const { data } = await axios.get(path, {
        baseURL: NETWORK.TERRA_ASSETS_URL,
      })
      return data
    }
  )

  return result
}

export default useTerraAssets
