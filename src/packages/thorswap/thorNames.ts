import { BlockChainType } from 'types'

export type ThorBlockChains =
  | BlockChainType.bitcoin
  | BlockChainType.ethereum
  | BlockChainType.terra
  | BlockChainType.bsc
  | BlockChainType.bch
  | BlockChainType.ltc
  | BlockChainType.doge

export const thorChainName: Record<ThorBlockChains, string> = {
  [BlockChainType.bitcoin]: 'BTC',
  [BlockChainType.ethereum]: 'ETH',
  [BlockChainType.terra]: 'TERRA',
  [BlockChainType.bsc]: 'BNB',
  [BlockChainType.bch]: 'BCH',
  [BlockChainType.ltc]: 'LTC',
  [BlockChainType.doge]: 'DOGE',
}

export const nativeThorAsset: Record<ThorBlockChains, string> = {
  [BlockChainType.bitcoin]: 'BTC.BTC',
  [BlockChainType.ethereum]: 'ETH.ETH',
  [BlockChainType.terra]: 'TERRA.LUNA',
  [BlockChainType.bsc]: 'BNB.BNB',
  [BlockChainType.ltc]: 'LTC.LTC',
  [BlockChainType.bch]: 'BCH.BCH',
  [BlockChainType.doge]: 'DOGE.DOGE',
}
