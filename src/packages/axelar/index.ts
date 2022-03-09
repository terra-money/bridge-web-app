import {
  AssetInfoWithTrace,
  AssetTransferObject,
  TransferAssetBridge,
  Chain,
  ChainInfo,
  ChainList,
  AssetInfo,
} from '@axelar-network/axelarjs-sdk'
import { ethers } from 'ethers'
import metaMaskService from 'services/metaMaskService'

class AxelarAPI {
  private axelarJsSDK: TransferAssetBridge

  constructor(environment: 'testnet' | 'mainnet') {
    this.axelarJsSDK = new TransferAssetBridge(environment)
  }

  public async getOneTimeMessageToSign(
    sigerAddress: string
  ): Promise<{ validationMsg: string; otc: string }> {
    try {
      return await this.axelarJsSDK.getOneTimeCode(sigerAddress)
    } catch (e: any) {
      throw e
    }
  }

  public async getDepositAddress(
    payload: AssetTransferObject,
    showAlerts: boolean = true
  ): Promise<AssetInfoWithTrace> {
    try {
      return this.axelarJsSDK.getDepositAddress(payload, showAlerts)
    } catch (e: any) {
      throw e
    }
  }
}

const getParameters = (
  destinationAddress: string,
  destinationChainName: 'avalanche' | 'fantom',
  asset_common_key: 'uusd' | 'uluna',
): AssetTransferObject => {
  
  /*
      info for sourceChainInfo and destinationChainInfo fetched from the ChainList module. 
      * */
  const chainInfoList: ChainInfo[] = ChainList.map(
    (chain: Chain) => chain.chainInfo
  )
  const terraChain: ChainInfo = chainInfoList.find(
    (chainInfo: ChainInfo) =>
      chainInfo.chainName.toLowerCase() === 'terra'
  ) as ChainInfo

  const destinationChain: ChainInfo = chainInfoList.find(
    (chainInfo: ChainInfo) =>
      chainInfo.chainName.toLowerCase() === destinationChainName.toLowerCase()
  ) as ChainInfo
  const assetObj = terraChain.assets?.find(
    (asset: AssetInfo) => asset.common_key === asset_common_key
  ) as AssetInfo

  let requestPayload: AssetTransferObject = {
    sourceChainInfo: terraChain,
    destinationChainInfo: destinationChain,
    selectedSourceAsset: assetObj,
    selectedDestinationAsset: {
      ...assetObj,
      assetAddress: destinationAddress, //address on the destination chain where you want the tokens to arrive
    },
    signature: 'SIGNATURE_FROM_METAMASK_SIGN',
    otc: 'OTC_RECEIVED_FROM_SERVER',
    publicAddr: 'SIGNER_OF_SIGNATURE',
    //transactionTraceId: 'YOUR_OWN_UUID', //your own UUID, helpful for tracing purposes. optional.
  }

  return requestPayload
}

export async function getAxelarAddress(toAddress: string, coin: 'uusd' | 'uluna'): Promise<string> {
  const api = new AxelarAPI('testnet')
  const { validationMsg, otc } = await api.getOneTimeMessageToSign(toAddress)
  const { provider } = await metaMaskService.connect()

  const signer = new ethers.providers.Web3Provider(provider, 'any').getSigner()

  const signature = await signer.signMessage(validationMsg)

  const parameters: AssetTransferObject = getParameters(
    toAddress,
    'avalanche',
    coin
  )
  parameters.otc = otc
  parameters.publicAddr = publicAddr
  parameters.signature = signature

  return ''
}
