import { ComponentType, ReactElement, SVGAttributes } from 'react'

import { COLOR } from 'consts'

import TerraPng from 'images/Terra.png'
import BinancePng from 'images/BinanceChain.png'
import MetamaskPng from 'images/Metamask.png'
import WalletConnectPng from 'images/WalletConnect.png'
import CoinbaseWalletPng from 'images/CoinbaseWallet.png'
import { WalletEnum } from 'types/wallet'
import FormImage from './FormImage'

interface IconProps extends SVGAttributes<SVGElement> {
  color?: string
  size?: string | number
}

const walletLogo: Record<WalletEnum, string | ComponentType<IconProps>> = {
  [WalletEnum.TerraExtension]: TerraPng,
  [WalletEnum.Binance]: BinancePng,
  [WalletEnum.MetaMask]: MetamaskPng,
  [WalletEnum.WalletConnect]: WalletConnectPng,
  [WalletEnum.TerraWalletConnect]: WalletConnectPng,
  [WalletEnum.CoinbaseWallet]: CoinbaseWalletPng,
}

const WalletLogo = ({
  walleEnum,
  size = 24,
  style,
}: {
  walleEnum: WalletEnum
  size?: number
  style?: React.CSSProperties
}): ReactElement => {
  const Logo = walletLogo[walleEnum]

  return typeof Logo === 'string' ? (
    <FormImage src={Logo} size={size} style={style} />
  ) : (
    <Logo size={size} color={COLOR.primary} style={style} />
  )
}

export default WalletLogo
