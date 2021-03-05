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
      if (fromBlockChain === BlockChainType.bsc) {
        return `https://${
          isTestnet ? 'testnet.' : ''
        }bscscan.com/${type}/${address}`
      }
      return `https://${
        isTestnet ? `${etherBaseExt.name}.` : ''
      }etherscan.io/${type}/${address}`
    }
    return ''
  }

  return {
    getScannerLink,
  }
}

export default useNetwork
