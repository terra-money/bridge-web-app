import useMantle from './useMantle'

interface FeeAmount {
  Amount: string
  Denom: string
}
interface TxLog {
  Events: TxEvent[]
}
interface TxEvent {
  Attributes: Attribute[]
  Type: string
}
interface Attribute {
  Key: string
  Value: string
}
interface TxInfo {
  Success: boolean
  RawLog: string
  TxHash: string
  Tx: {
    Fee: { Amount: FeeAmount[] }
    Memo: string
  }
  Logs: TxLog[]
}

const useTerraTxInfo = (): {
  getTxInfos: ({ hash }: { hash: string }) => Promise<TxInfo[]>
} => {
  const txInfosQuery = `
query($hash: String) {
  TxInfos(TxHash: $hash) {
    Height
    TxHash
    Success
    RawLog
    Tx {
      Fee {
        Amount {
          Amount
          Denom
        }
      }
      Memo
    }
    Logs {
      Events {
        Type
        Attributes {
          Key
          Value
        }
      }
    }
  }
}
`
  const { fetchQuery } = useMantle()

  const getTxInfos = async ({ hash }: { hash: string }): Promise<TxInfo[]> => {
    const fetchResult: { TxInfos: TxInfo[] } = await fetchQuery({
      query: txInfosQuery,
      variables: JSON.stringify({ hash }),
    })
    if (fetchResult && fetchResult.TxInfos) {
      return fetchResult.TxInfos
    }
    return []
  }

  return {
    getTxInfos,
  }
}

export default useTerraTxInfo
