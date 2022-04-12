import { ComponentType, ReactElement, SVGAttributes } from 'react'

import { COLOR } from 'consts'

import TerraSvg from 'images/terra.svg'
import BinanceSvg from 'images/bsc.svg'
import MetamaskSvg from 'images/metamask.svg'
import WalletConnectSvg from 'images/walletconnect.svg'
import CoinbaseWalletPng from 'images/CoinbaseWallet.png'
import KeplrPng from 'images/Keplr.png'
import { WalletEnum } from 'types/wallet'
import FormImage from './FormImage'

interface IconProps extends SVGAttributes<SVGElement> {
  color?: string
  size?: string | number
}

const walletLogo: Record<WalletEnum, string | ComponentType<IconProps>> = {
  [WalletEnum.TerraExtension]: TerraSvg,
  [WalletEnum.Binance]: BinanceSvg,
  [WalletEnum.MetaMask]: MetamaskSvg,
  [WalletEnum.WalletConnect]: WalletConnectSvg,
  [WalletEnum.TerraWalletConnect]: WalletConnectSvg,
  [WalletEnum.CoinbaseWallet]: CoinbaseWalletPng,
  [WalletEnum.Keplr]: KeplrPng,
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
