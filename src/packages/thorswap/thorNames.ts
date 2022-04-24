import { BlockChainType } from 'types'

export type ThorBlockChains =
  | BlockChainType.bitcoin
  | BlockChainType.ethereum
  | BlockChainType.terra
  | BlockChainType.bsc

export const thorChainName: Record<ThorBlockChains, string> = {
  [BlockChainType.bitcoin]: 'BTC',
  [BlockChainType.ethereum]: 'ETH',
  [BlockChainType.terra]: 'TERRA',
  [BlockChainType.bsc]: 'BNB',
}

export const nativeThorAsset: Record<ThorBlockChains, string> = {
  [BlockChainType.bitcoin]: 'BTC.BTC',
  [BlockChainType.ethereum]: 'ETH.ETH',
  [BlockChainType.terra]: 'TERRA.LUNA',
  [BlockChainType.bsc]: 'BNB.BNB',
}

export const thorAssets: Record<string, string> = {
  uusd: 'UST',
  uluna: 'LUNA',
  btc: 'BTC',
  eth: 'ETH',
}
