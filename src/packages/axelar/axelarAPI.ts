import {
  AssetInfoWithTrace,
  AssetTransferObject,
  TransferAssetBridge,
} from '@axelar-network/axelarjs-sdk'

export class AxelarAPI {
  private environment: string
  private axelarJsSDK: TransferAssetBridge

  constructor(environment: string) {
    this.environment = environment
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
    showAlerts: boolean = false
  ): Promise<AssetInfoWithTrace> {
    try {
      return this.axelarJsSDK.getDepositAddress(payload, showAlerts)
    } catch (e: any) {
      throw e
    }
  }
}
