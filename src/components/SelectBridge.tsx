import { ReactElement } from 'react'
//import styled from 'styled-components'

import { COLOR } from 'consts'

import { availableBridges, BlockChainType, BridgeType } from 'types/network'

import { Text } from 'components'
import FormSelect from 'components/FormSelect'
import { useRecoilValue, useRecoilState } from 'recoil'
import SendProcessStore, { ProcessStatus } from 'store/SendProcessStore'
import SendStore from 'store/SendStore'
import NetworkStore from 'store/NetworkStore'
import useAuth from 'hooks/useAuth'

const SelectBridge = (): ReactElement => {
  const status = useRecoilValue(SendProcessStore.sendProcessStatus)
  const toBlockChain = useRecoilValue(SendStore.toBlockChain)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)
  const [bridgeUsed, setBridgeUsed] = useRecoilState(SendStore.bridgeUsed)
  const isTestnet = useRecoilValue(NetworkStore.isTestnet)
  const { setBlockchainStorage } = useAuth()

  const bridges =
    availableBridges[
      toBlockChain === BlockChainType.terra ? fromBlockChain : toBlockChain
    ]

  const bridgesList = bridges.map((b) => {
    return {
      value: b,
      isDisabled: b === BridgeType.axelar && isTestnet,
      label: (b as string).toUpperCase(),
      warning:
        b === BridgeType.shuttle
          ? 'Shuttle is scheduled to be deprecated - use at own risk.'
          : '',
    }
  })

  return (
    <div
      style={{
        position: 'absolute',
        transform: 'translate(-50%,0)',
        width: window.innerWidth > 450 ? '115px' : '105px',
        textAlign: 'center',
      }}
    >
      <div>
        {bridges.length > 1 && status === ProcessStatus.Input ? (
          <FormSelect
            selectedValue={bridgeUsed}
            optionList={bridgesList}
            onSelect={(b): void => {
              setBlockchainStorage({
                fromBlockChain,
                toBlockChain,
                bridgeUsed: b,
              })
              setBridgeUsed(b)
            }}
            containerStyle={{
              width: '100%',
              backgroundColor: COLOR.primary,
              color: COLOR.darkGray,
              padding: '.5rem .8rem',
              marginTop: window.innerWidth > 450 ? '.3rem' : 0,
            }}
            selectedTextStyle={{
              fontWeight: '500',
              color: COLOR.darkGray,
            }}
            itemStyle={{
              padding: '.5rem .8rem',
            }}
          />
        ) : (
          <Text
            style={{
              color: COLOR.white,
              opacity: 0.6,
              padding: '.4rem .8rem',
              marginTop: '.6rem',
              fontSize: '12px',
              fontWeight: '500',
            }}
          >
            {bridgeUsed?.toUpperCase()}
          </Text>
        )}
      </div>
    </div>
  )
}

export default SelectBridge
