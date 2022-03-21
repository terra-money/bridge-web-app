import { TNS } from '@tns-money/tns.js'
import { useRecoilValue } from 'recoil'
import NetworkStore from 'store/NetworkStore'

export default function useTns(): {
  getName: (address: string) => Promise<string | undefined>
  getAddress: (name: string) => Promise<string | undefined>
} {
  const isTestnet = useRecoilValue(NetworkStore.isTestnet)

  const tns = new TNS({
    network: isTestnet ? 'testnet' : 'mainnet',
    mantleUrl: isTestnet
      ? 'https://bombay-mantle.terra.dev/'
      : 'https://mantle.terra.dev',
  })

  async function getName(address: string): Promise<string | undefined> {
    return await tns.getName(address)
  }

  async function getAddress(name: string): Promise<string | undefined> {
    return await tns.name(name).getTerraAddress()
  }

  return { getName, getAddress }
}
