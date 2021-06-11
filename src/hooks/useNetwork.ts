import { useRecoilValue } from 'recoil'

import NetworkStore from 'store/NetworkStore'
import SendStore from 'store/SendStore'

import { BlockChainType } from 'types/network'

const useNetwork = (): {
  getScannerLink: (props: { address: string; type: 'tx' | 'address' }) => string
} => {
  const FINDER = 'https://finder.terra.money'
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)
  const terraExt = useRecoilValue(NetworkStore.terraExt)
  const etherBaseExt = useRecoilValue(NetworkStore.etherBaseExt)
  const keplrLocal = useRecoilValue(NetworkStore.keplrLocal)
  const isTestnet = useRecoilValue(NetworkStore.isTestnet)

  const getScannerLink = ({
    address,
    type,
  }: {
    address: string
    type: 'tx' | 'address'
  }): string => {
    if (fromBlockChain === BlockChainType.terra && terraExt) {
      return `${FINDER}/${terraExt.chainID}/${type}/${address}`
    } else if (etherBaseExt) {
      let subdomain = ''

      if (fromBlockChain === BlockChainType.bsc) {
        subdomain = isTestnet ? 'testnet.' : ''
        return `https://${subdomain}bscscan.com/${type}/${address}`
      }

      subdomain = isTestnet ? `${etherBaseExt.name}.` : ''
      return `https://${subdomain}etherscan.io/${type}/${address}`
    } else if (keplrLocal) {
      const pageType = type === 'tx' ? 'transactions' : 'accounts'
      return `https://secretnodes.com/secret/chains/${keplrLocal.chainID}/${pageType}/${address}`
    }
    return ''
  }

  return {
    getScannerLink,
  }
}

export default useNetwork
