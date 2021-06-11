import { isBrowser, isChrome, isEdgeChromium } from 'react-device-detect'

export enum WalletEnum {
  TerraExtension = 'TerraExtension',
  Binance = 'Binance',
  MetaMask = 'MetaMask',
  TerraWalletConnect = 'TerraWalletConnect',
  WalletConnect = 'WalletConnect',
  CoinbaseWallet = 'CoinbaseWallet',
  Keplr_Secret = 'Keplr_Secret',
  Keplr_Holodeck = 'Keplr_Holodeck',
}

export const WalletTitle: Record<WalletEnum, string> = {
  TerraExtension: 'Terra Station (Extension)',
  TerraWalletConnect: 'Terra Station (Mobile)',
  Binance: 'Binance Chain Wallet',
  MetaMask: 'MetaMask',
  WalletConnect: 'WalletConnect',
  CoinbaseWallet: 'Coinbase Wallet',
  Keplr_Secret: 'Keplr Wallet (Secret)',
  Keplr_Holodeck: 'Keplr Wallet (Holodeck)',
}

export const WalletSupportBrowser: Record<
  WalletEnum,
  { isSupport: boolean; errorMessage: string }
> = {
  TerraExtension: {
    isSupport: isBrowser && (isChrome || isEdgeChromium),
    errorMessage: 'Available for desktop Chrome.',
  },
  // support all browser
  TerraWalletConnect: {
    isSupport: true,
    errorMessage: '',
  },
  Binance: {
    isSupport: isBrowser && (isChrome || isEdgeChromium),
    errorMessage: 'Available for desktop Chrome.',
  },
  MetaMask: {
    isSupport: isBrowser && (isChrome || isEdgeChromium),
    errorMessage: 'Available for desktop Chrome.',
  },
  // support all browser
  WalletConnect: { isSupport: true, errorMessage: '' },
  CoinbaseWallet: {
    isSupport: isBrowser,
    errorMessage: 'Available for desktop browsers.',
  },
  Keplr_Secret: {
    isSupport: false, // TODO
    errorMessage: 'Not available now',
  },
  Keplr_Holodeck: {
    isSupport: isBrowser && (isChrome || isEdgeChromium),
    errorMessage: 'Available for desktop Chrome.',
  },
}
