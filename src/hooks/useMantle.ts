import { useRecoilValue } from 'recoil'

import NetworkStore from 'store/NetworkStore'

const useMantle = (): {
  fetchQuery: ({
    query,
    variables,
  }: {
    query: string
    variables?: string
  }) => Promise<any> | undefined
} => {
  const terraLocal = useRecoilValue(NetworkStore.terraLocal)

  const fetchQuery = ({
    query,
    variables,
  }: {
    query: string
    variables?: string
  }): Promise<any> | undefined =>
    terraLocal
      ? fetch(terraLocal.mantle, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, variables }),
        })
          .then((res) => res.json())
          .then((res) => res.data)
      : undefined

  return {
    fetchQuery,
  }
}

export default useMantle
