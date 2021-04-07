import { atom } from 'recoil'
import { RequestTxResultType } from 'types/send'

export enum ProcessStatus {
  Input, // input what will user do
  Confirm, // check what will user do
  Submit, // requst aprove from extension or wallets(coinbase/walletconnect)
  Pending, // waiting to finish tx on blockchain
  Done,
  Failed, // done but failed
}

const sendProcessStatus = atom<ProcessStatus>({
  key: 'sendProcessStatus',
  default: ProcessStatus.Input,
})

const requestTxResult = atom<RequestTxResultType>({
  key: 'requestTxResult',
  default: { success: false },
})

const waitForReceiptError = atom<string>({
  key: 'waitForReceiptError',
  default: '',
})

export default {
  sendProcessStatus,
  requestTxResult,
  waitForReceiptError,
}
