import MetaMaskOnboarding from '@metamask/onboarding'
import { NETWORK } from 'consts'
import { BlockChainType } from 'types'

const { ETH_CHAINID } = NETWORK

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

// functions to suggest networks
async function addNetworkAndSwitch(
  network: BlockChainType,
  target: number,
  testnet?: number
): Promise<void> {
  const formatChainId = (n: number): string => '0x' + n.toString(16)
  const currentChain = window.ethereum?.networkVersion
  // if network is allowed return
  /* eslint eqeqeq: "off" */
  if (currentChain == target || currentChain == testnet) return

  // else try to suggest chain
  try {
    await window.ethereum?.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: formatChainId(target),
        },
      ],
    })
  } catch (e) {
    // if metamask doesn't have the network
    if (e.code === 4902) {
      // suggest network
      await window.ethereum?.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: formatChainId(target),
            chainName: NETWORK.blockChainName[network],
            rpcUrls: NETWORK.metamaskRpc[network],
          },
        ],
      })
    } else {
      throw new Error(e)
    }
  }
}

const switchNetwork = async (network: BlockChainType): Promise<void> => {
  switch (network) {
    case BlockChainType.ethereum:
      await addNetworkAndSwitch(
        network,
        ETH_CHAINID.ETH_MAIN,
        ETH_CHAINID.ETH_ROPSTEN
      )
      return
    case BlockChainType.bsc:
      await addNetworkAndSwitch(
        network,
        ETH_CHAINID.BSC_MAIN,
        ETH_CHAINID.BSC_TEST
      )
      return
    case BlockChainType.hmy:
      await addNetworkAndSwitch(
        network,
        ETH_CHAINID.HMY_MAIN,
        ETH_CHAINID.HMY_TEST
      )
      return
    case BlockChainType.avalanche:
      await addNetworkAndSwitch(network, ETH_CHAINID.AVAX_MAIN)
      return
    case BlockChainType.fantom:
      await addNetworkAndSwitch(network, ETH_CHAINID.FTM_MAIN)
      return
    case BlockChainType.polygon:
      await addNetworkAndSwitch(network, ETH_CHAINID.POLY_MAIN)
      return
    case BlockChainType.moonbeam:
      await addNetworkAndSwitch(network, ETH_CHAINID.MOON_MAIN)
      return
  }
}

export default { connect, checkInstalled, install, switchNetwork }
