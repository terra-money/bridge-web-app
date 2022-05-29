import useMantle from './useMantle'

interface TxInfo {
  Success: boolean
  RawLog: string
  TxHash: string
}

const useTerraTxInfo = (): {
  getTxInfos: ({ hash }: { hash: string }) => Promise<TxInfo[]>
} => {
  const { fetchQuery } = useMantle()

  const getTxInfos = async ({ hash }: { hash: string }): Promise<TxInfo[]> => {
    const fetchResult: any = await fetchQuery({
      query: `
      {
        tx {
          txInfo(txHash:"${hash}"){
            code
            txhash
            raw_log
          }
        }
      }
    `,
      variables: JSON.stringify({ hash }),
    })
    if (fetchResult) {
      return fetchResult.tx.txInfo as TxInfo[]
    }
    return []
  }

  return {
    getTxInfos,
  }
}

export default useTerraTxInfo
