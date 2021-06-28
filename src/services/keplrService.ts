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

  if (CHAIN_ID === 'holodeck-2' && window.keplr.experimentalSuggestChain) {
    try {
      await window.keplr.experimentalSuggestChain({
        chainId: CHAIN_ID,
        chainName: 'Secret Testnet',
        rpc: 'https://bootstrap.secrettestnet.io:26667',
        rest: 'https://bootstrap.secrettestnet.io',
        bip44: { coinType: 529 },
        coinType: 529,
        stakeCurrency: {
          coinDenom: 'SCRT',
          coinMinimalDenom: 'uscrt',
          coinDecimals: 6,
        },
        bech32Config: {
          bech32PrefixAccAddr: 'secret',
          bech32PrefixAccPub: 'secretpub',
          bech32PrefixValAddr: 'secretvaloper',
          bech32PrefixValPub: 'secretvaloperpub',
          bech32PrefixConsAddr: 'secretvalcons',
          bech32PrefixConsPub: 'secretvalconspub',
        },
        currencies: [
          { coinDenom: 'SCRT', coinMinimalDenom: 'uscrt', coinDecimals: 6 },
        ],
        feeCurrencies: [
          { coinDenom: 'SCRT', coinMinimalDenom: 'uscrt', coinDecimals: 6 },
        ],
        gasPriceStep: { low: 0.1, average: 0.25, high: 0.4 },
        features: ['secretwasm'],
      })
    } catch (error) {
      console.error(error)
    }
  }

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
