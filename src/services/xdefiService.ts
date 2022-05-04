import axios from 'axios'
import { BlockChainType } from 'types'

export default {
  checkInstalled(): boolean {
    return !!window.xfi
  },

  async connect(chain: BlockChainType): Promise<string> {
    if (chain === BlockChainType.bitcoin) {
      return new Promise((resolve, reject) => {
        window.xfi.bitcoin.request(
          { method: 'request_accounts', params: [] },
          (error: { id: number; error: string }, accounts: string[]): void => {
            if (error || accounts.length === 0) {
              reject(error?.error || 'No accounts')
            } else {
              resolve(accounts[0])
            }
          }
        )
      })
    } else {
      return Promise.reject('Chain not supported')
    }
  },

  async send(
    from: string,
    recipient: string,
    amount: string,
    memo: string
  ): Promise<any> {
    const { data }: { data: any[] } = await axios.get(
      'https://midgard.thorswap.net/v2/thorchain/inbound_addresses'
    )
    // TODO: update gas calculation for other chains
    const feeRate = parseInt(
      data.filter((c) => c.chain === 'BTC')[0]['gas_rate']
    )

    return new Promise((resolve, reject) => {
      window.xfi.bitcoin.request(
        {
          method: 'transfer',
          params: [
            {
              feeRate,
              from,
              recipient,
              amount: {
                amount,
                decimals: 8,
              },
              memo,
            },
          ],
        },
        (error: any, result: any): void => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        }
      )
    })
  },
}
