import { TNS } from '@tns-money/tns.js'

export default function useTns(): {
  getName: (address: string) => Promise<string | undefined>
  getAddress: (name: string) => Promise<string | undefined>
} {
  const tns = new TNS({
    network: 'mainnet',
    mantleUrl: 'https://columbus-mantle.terra.dev',
  })

  async function getName(address: string): Promise<string | undefined> {
    return await tns.getName(address)
  }

  async function getAddress(name: string): Promise<string | undefined> {
    if (!name.endsWith('.ust')) return undefined
    try {
      return await tns.name(name).getTerraAddress()
    } catch {
      return undefined
    }
  }

  return { getName, getAddress }
}
