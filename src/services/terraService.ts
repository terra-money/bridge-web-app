import {
  CreateTxOptions,
  Extension,
  SyncTxBroadcastResult,
} from '@terra-money/terra.js'
import { LocalTerraNetwork } from 'types/network'

const ext = new Extension()

export type Result = SyncTxBroadcastResult.Data
export interface PostResponse {
  id: number
  origin: string
  success: boolean
  result?: Result
  error?: { code: number; message?: string }
}

export default {
  checkInstalled(): boolean {
    return ext.isAvailable
  },

  async info(): Promise<LocalTerraNetwork> {
    const res = await ext.request('info')
    return res.payload as any
  },

  async connect(): Promise<{ address: string }> {
    const res = await ext.request('connect')
    return res.payload as any
  },

  async post(
    options: Omit<CreateTxOptions, 'msgs'> & { msgs: string[] }
  ): Promise<PostResponse> {
    const data = JSON.parse(JSON.stringify(options))
    const res = await ext.request('post', data)

    return res.payload as any
  },
}
