import { ReactElement } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { COLOR } from 'consts'
import { Text } from 'components'
import DefaultModal from 'components/Modal'

import NetworkStore from 'store/NetworkStore'

const NotSupportNetworkModal = (): ReactElement => {
  const [isVisibleModal, setIsVisibleModal] = useRecoilState(
    NetworkStore.isVisibleNotSupportNetworkModal
  )
  const network = useRecoilValue(NetworkStore.triedNotSupportNetwork)
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
      {network?.chainId === 'pisco-1' || network?.chainId === 'phoenix-1' ? (
        <p
          style={{
            textAlign: 'center',
            color: '#CCC',
            margin: '0 4rem',
            marginBottom: '2.3rem',
          }}
        >
          Your extension is connected to <b>{network?.chainId}</b>, please
          switch to Terra Classic or use the{' '}
          <a
            href="https://bridge.terra.money"
            style={{
              color: COLOR.terraSky,
              textDecoration: 'underline',
            }}
          >
            Bridge 2.0
          </a>
        </p>
      ) : (
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
      )}
    </DefaultModal>
  )
}

export default NotSupportNetworkModal
