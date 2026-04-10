import { OfflineSigner } from '@cosmjs/proto-signing'

interface KeplrChainInfo {
  rpc: string
  rest: string
  chainId: string
  chainName: string
  bip44: { coinType: number }
  bech32Config: {
    bech32PrefixAccAddr: string
    bech32PrefixAccPub: string
    bech32PrefixValAddr: string
    bech32PrefixValPub: string
    bech32PrefixConsAddr: string
    bech32PrefixConsPub: string
  }
  currencies: Array<{
    coinDenom: string
    coinMinimalDenom: string
    coinDecimals: number
  }>
  stakeCurrency: {
    coinDenom: string
    coinMinimalDenom: string
    coinDecimals: number
  }
  feeCurrencies: Array<{
    coinDenom: string
    coinMinimalDenom: string
    coinDecimals: number
  }>
}

declare global {
  interface Window {
    keplr: {
      enable(chainIds: string | string[]): Promise<void>
      experimentalSuggestChain(chainInfo: KeplrChainInfo): Promise<void>
      getOfflineSigner(chainId: string): OfflineSigner
      getOfflineSignerOnlyAmino(chainId: string): OfflineSigner
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any
    }
    getOfflineSignerOnlyAmino: ((chainId: string) => OfflineSigner) | undefined
  }
}
