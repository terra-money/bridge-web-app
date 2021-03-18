import { ReactElement } from 'react'
// import { useSetRecoilState } from 'recoil'

// import { useModal } from 'components/Modal'
// import SendProcessModal from 'components/Modal/SendProcessModal'

// import SendProcessStore, { ProcessStatus } from 'store/SendProcessStore'

// import SendForm from './SendForm'
import UnderConstruction from './UnderConstruction'

const Send = (): ReactElement => {
  // const sendTxModal = useModal()
  // const setSendProcessStatus = useSetRecoilState(
  //   SendProcessStore.sendProcessStatus
  // )

  // const onClickSendButton = async (): Promise<void> => {
  //   setSendProcessStatus(ProcessStatus.Confirm)
  //   sendTxModal.open()
  // }

  return (
    <>
      <UnderConstruction />
      {/* <SendForm onClickSendButton={onClickSendButton} />
      <SendProcessModal {...sendTxModal} /> */}
    </>
  )
}

export default Send
