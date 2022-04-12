import { SigningStargateClient } from '@cosmjs/stargate'
import _ from 'lodash'
import { BlockChainType, ibcChainId, IbcNetwork, ibcRpc } from 'types'
import { NETWORK } from 'consts'

const checkInstalled = (): boolean => {
  return _.some(window.keplr)
}

const connect = async (
  chain: BlockChainType
): Promise<{
  address: string
  signingCosmosClient: SigningStargateClient
}> => {
  const keplr = window.keplr
  const CHAIN_ID = ibcChainId[chain as IbcNetwork]

  // suggest network (needed for injective since it's not in the default chains)
  if (chain === BlockChainType.inj && keplr.experimentalSuggestChain) {
    try {
      await keplr.experimentalSuggestChain({
        chainId: CHAIN_ID,
        chainName: NETWORK.blockChainName[chain],
        rpc: ibcRpc[chain],
        rest: 'https://lcd.injective.network/',
        bip44: { coinType: 529 },
        coinType: 529,
        stakeCurrency: {
          coinDenom: 'INJ',
          coinMinimalDenom: 'inj',
          coinDecimals: 18,
        },
        bech32Config: {
          bech32PrefixAccAddr: 'inj',
          bech32PrefixAccPub: 'injpub',
          bech32PrefixValAddr: 'injvaloper',
          bech32PrefixValPub: 'injvaloperpub',
          bech32PrefixConsAddr: 'injvalcons',
          bech32PrefixConsPub: 'injvalconspub',
        },
        currencies: [
          { coinDenom: 'INJ', coinMinimalDenom: 'inj', coinDecimals: 18 },
        ],
        feeCurrencies: [
          { coinDenom: 'INJ', coinMinimalDenom: 'inj', coinDecimals: 18 },
        ],
        gasPriceStep: { low: 500000000, average: 500000000, high: 500000000 },
      })
    } catch (error) {
      console.error(error)
    }
  }

  keplr.enable(CHAIN_ID)
  const keplrOfflineSigner = await keplr.getOfflineSignerAuto(CHAIN_ID)
  const accounts = await keplrOfflineSigner.getAccounts()
  const address = accounts[0].address

  const signingCosmosClient = await SigningStargateClient.connectWithSigner(
    ibcRpc[chain as IbcNetwork],
    keplrOfflineSigner
  )

  // @ts-expect-error
  signingCosmosClient.chainId = CHAIN_ID

  return { address, signingCosmosClient }
}

export default { connect, checkInstalled }
