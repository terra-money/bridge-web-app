import { ReactElement, useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { Text } from 'components'
import DefaultModal from 'components/Modal'

import NetworkStore from 'store/NetworkStore'

const NotSupportNetworkModal = (): ReactElement => {
  const [isVisibleModal, setIsVisibleModal] = useRecoilState(
    NetworkStore.isVisibleNotSupportNetworkModal
  )

  const isTestnet = useRecoilValue(NetworkStore.isTestnet)

  useEffect(() => {
    isTestnet && setIsVisibleModal(true)
  }, [isTestnet])

  return (
    <DefaultModal
      {...{
        isOpen: isVisibleModal,
        close: (): void => {
          setIsVisibleModal(false)
        },
      }}
      header={
        <Text style={{ justifyContent: 'center' }}>UNSUPPORTED NETWORK</Text>
      }
    >
      <p
        style={{
          textAlign: 'center',
          color: '#CCC',
          margin: '0 4rem',
          marginBottom: '2.3rem',
        }}
      >
        Bridge does not support the testnet, please switch to mainnet and
        refresh the page in order to use it
      </p>
    </DefaultModal>
  )
}

export default NotSupportNetworkModal
