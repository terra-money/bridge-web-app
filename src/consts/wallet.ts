import TerraPng from 'images/Terra.png'
import BinancePng from 'images/BinanceChain.png'
import MetamaskPng from 'images/Metamask.png'
import WalletConnectPng from 'images/WalletConnect.png'
import CoinbaseWalletPng from 'images/CoinbaseWallet.png'
import { WalletEnum } from 'types/wallet'

const walletLogo: Record<WalletEnum, string> = {
  [WalletEnum.TerraStation]: TerraPng,
  [WalletEnum.Binance]: BinancePng,
  [WalletEnum.MetaMask]: MetamaskPng,
  [WalletEnum.WalletConnect]: WalletConnectPng,
  [WalletEnum.CoinbaseWallet]: CoinbaseWalletPng,
}

export default {
  walletLogo,
}
