import { atom } from 'recoil'

export enum ProcessStatus {
  Confirm, // check what will user do
  Submit, // requst aprove from extension or wallets(coinbase/walletconnect)
  Pending, // waiting to finish tx on blockchain
  Done,
}

const sendProcessStatus = atom<ProcessStatus>({
  key: 'sendProcessStatus',
  default: ProcessStatus.Confirm,
})

export default {
  sendProcessStatus,
}
