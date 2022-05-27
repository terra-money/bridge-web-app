import { ReactElement, useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { Text } from 'components'
import DefaultModal from 'components/Modal'

import NetworkStore from 'store/NetworkStore'
import { COLOR } from 'consts'

const NotSupportNetworkModal = (): ReactElement => {
  const [isVisibleModal, setIsVisibleModal] = useRecoilState(
    NetworkStore.isVisibleNotSupportNetworkModal
  )

  const isTestnet = useRecoilValue(NetworkStore.isTestnet)
  const network = useRecoilValue(NetworkStore.triedNotSupportNetwork)

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
      {network?.chainId === 'columbus-5' ? (
        <p
          style={{
            textAlign: 'center',
            color: '#CCC',
            margin: '0 4rem',
            marginBottom: '2.3rem',
          }}
        >
          Your extension is connected to <b>{network?.chainId}</b>, please
          switch to Terra 2.0 or use the{' '}
          <a
            href="https://classic-bridge.terra.money"
            style={{
              color: COLOR.terraSky,
              textDecoration: 'underline',
            }}
          >
            Classic Bridge
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
