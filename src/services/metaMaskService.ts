import MetaMaskOnboarding from '@metamask/onboarding'

if (window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

const checkInstalled = (): boolean => {
  return MetaMaskOnboarding.isMetaMaskInstalled()
}

const connect = async (): Promise<{
  address: string
  provider: any
}> => {
  const method = 'eth_requestAccounts'
  const accounts = await window.ethereum?.request({ method })
  const address = (accounts && accounts[0]) || ''

  const provider = window.ethereum
  return { address, provider }
}

const install = (): void => {
  const metamask = new MetaMaskOnboarding()
  metamask.startOnboarding()
}

export default { connect, checkInstalled, install }
