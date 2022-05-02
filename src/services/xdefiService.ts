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
            console.log('ending xdefi')
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
}
