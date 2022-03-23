import { ReactElement } from 'react'
//import styled from 'styled-components'

import { COLOR } from 'consts'

import { availableBridges, BlockChainType } from 'types/network'

import { Text } from 'components'
import FormSelect from 'components/FormSelect'
import { useRecoilValue, useRecoilState } from 'recoil'
//import SendProcessStore from 'store/SendProcessStore'
import SendStore from 'store/SendStore'

const SelectBridge = (): ReactElement => {
  //const status = useRecoilValue(SendProcessStore.sendProcessStatus)
  const toBlockChain = useRecoilValue(SendStore.toBlockChain)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)
  const [bridgeUsed, setBridgeUsed] = useRecoilState(SendStore.bridgeUsed)

  const bridges =
    availableBridges[
      toBlockChain === BlockChainType.terra ? fromBlockChain : toBlockChain
    ]

  const bridgesList = bridges.map((b) => {
    return { value: b, isDisabled: false, label: (b as string).toUpperCase() }
  })

  return bridges.length > 1 ? (
    <FormSelect
      selectedValue={bridgeUsed}
      optionList={bridgesList}
      onSelect={(b): void => setBridgeUsed(b)}
      containerStyle={{
        width: '100%',
        backgroundColor: COLOR.primary,
        color: COLOR.darkGray,
        padding: '.5rem .8rem',
        marginTop: '.6rem',
      }}
      selectedTextStyle={{
        fontSize: '12px',
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
        width: '100%',
        color: COLOR.white,
        opacity: 0.6,
        padding: '.4rem .8rem',
        marginTop: '.6rem',
        fontSize: '12px',
        fontWeight: '500',
      }}
    >
      {bridgesList[0]?.label}
    </Text>
  )
}

export default SelectBridge
