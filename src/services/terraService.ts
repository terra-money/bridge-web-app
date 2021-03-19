import {
  CreateTxOptions,
  Extension,
  SyncTxBroadcastResult,
} from '@terra-money/terra.js'
import { ExtTerraNetwork } from 'types/network'

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

  async info(): Promise<ExtTerraNetwork> {
    const res = await ext.request('info')
    return res.payload as any
  },

  async connect(): Promise<{ address: string }> {
    const res = await ext.request('connect')
    return res.payload as any
  },

  async post(options: CreateTxOptions): Promise<PostResponse> {
    const res = await ext.request('post', JSON.parse(JSON.stringify(options)))

    return res.payload as any
  },
}
