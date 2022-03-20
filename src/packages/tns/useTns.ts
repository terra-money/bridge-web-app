import { TNS } from '@tns-money/tns.js'
import { useRecoilValue } from 'recoil'
import NetworkStore from 'store/NetworkStore'

export default function useTns(): {
  getName: (address: string) => Promise<string>
  getAddress: (name: string) => Promise<string | undefined>
} {
  const isTestnet = useRecoilValue(NetworkStore.isTestnet)
  const terraLocal = useRecoilValue(NetworkStore.terraLocal)

  const tns = new TNS({
    network: isTestnet ? 'testnet' : 'mainnet',
    mantleUrl: terraLocal?.mantle || 'https://mantle.terra.dev',
  })

  async function getName(address: string): Promise<string> {
    return await tns.getName(address)
  }

  async function getAddress(name: string): Promise<string | undefined> {
    return await tns.name('bucky.ust').getTerraAddress()
  }

  return { getName, getAddress }
}
