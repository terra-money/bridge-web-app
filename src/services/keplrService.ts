import { SigningCosmWasmClient } from 'secretjs'
import _ from 'lodash'
import { NETWORK } from 'consts'

const checkInstalled = (): boolean => {
  return _.some(window.getOfflineSigner && window.keplr)
}

const connect = async ({
  isMainnet,
}: {
  isMainnet: boolean
}): Promise<{
  address: string
  signingCosmWasmClient: SigningCosmWasmClient
}> => {
  // TODO :
  const secretNetworks =
    NETWORK.secret_networks[isMainnet ? 'mainnet' : 'testnet']
  const CHAIN_ID = secretNetworks.chainID

  await window.keplr.enable(CHAIN_ID)
  const keplrOfflineSigner = window.getOfflineSigner(CHAIN_ID)
  const accounts = await keplrOfflineSigner.getAccounts()
  const address = accounts[0].address

  const signingCosmWasmClient = new SigningCosmWasmClient(
    secretNetworks.apiUrl,
    address,
    // @ts-ignore
    keplrOfflineSigner,
    window.getEnigmaUtils(CHAIN_ID),
    {
      exec: getFeeForExecute(400_000),
    }
  )

  return { address, signingCosmWasmClient }
}

export default { connect, checkInstalled }

const gasPriceUscrt = 0.25
function getFeeForExecute(
  gas: number
): {
  amount: {
    amount: string
    denom: string
  }[]
  gas: string
} {
  return {
    amount: [
      { amount: String(Math.floor(gas * gasPriceUscrt) + 1), denom: 'uscrt' },
    ],
    gas: String(gas),
  }
}
