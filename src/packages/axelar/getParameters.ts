import {
  AssetInfo,
  AssetTransferObject,
  Chain,
  ChainInfo,
  ChainList,
} from '@axelar-network/axelarjs-sdk'

export const getParameters = (
  destinationAddress: string,
  sourceChainName: string, // = 'axelar',
  destinationChainName: string,
  asset_common_key: string
): AssetTransferObject => {
  /*
      info for sourceChainInfo and destinationChainInfo fetched from the ChainList module. 
      * */
  const chainInfoList: ChainInfo[] = ChainList.map(
    (chain: Chain) => chain.chainInfo
  )
  const terraChain: ChainInfo = chainInfoList.find(
    (chainInfo: ChainInfo) =>
      chainInfo.chainName.toLowerCase() === sourceChainName.toLowerCase()
  ) as ChainInfo
  const avalancheChain: ChainInfo = chainInfoList.find(
    (chainInfo: ChainInfo) =>
      chainInfo.chainName.toLowerCase() === destinationChainName.toLowerCase()
  ) as ChainInfo
  const assetObj = terraChain.assets?.find(
    (asset: AssetInfo) => asset.common_key === asset_common_key
  ) as AssetInfo

  let requestPayload: AssetTransferObject = {
    sourceChainInfo: terraChain,
    destinationChainInfo: avalancheChain,
    selectedSourceAsset: assetObj,
    selectedDestinationAsset: {
      ...assetObj,
      assetAddress: destinationAddress, //address on the destination chain where you want the tokens to arrive
    },
    signature: 'SIGNATURE_FROM_METAMASK_SIGN',
    otc: 'OTC_RECEIVED_FROM_SERVER',
    publicAddr: 'SIGNER_OF_SIGNATURE',
    transactionTraceId: 'YOUR_OWN_UUID', //your own UUID, helpful for tracing purposes. optional.
  }

  return requestPayload
}
