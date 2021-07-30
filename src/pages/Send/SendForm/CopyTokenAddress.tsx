import { ReactElement } from 'react'
import { useRecoilValue } from 'recoil'

import SendStore from 'store/SendStore'
import { Text, View, Row, CopyTokenAddressButton } from 'components'

import useNetwork from 'hooks/useNetwork'

const CopyTokenAddress = (): ReactElement => {
  const asset = useRecoilValue(SendStore.asset)
  const toBlockChain = useRecoilValue(SendStore.toBlockChain)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)

  const { fromTokenAddress, toTokenAddress } = useNetwork()

  return (
    <>
      {asset && (fromTokenAddress || toTokenAddress) && (
        <Row
          style={{
            alignItems: 'center',
            paddingTop: 8,
          }}
        >
          <Text
            style={{ color: '#737373', fontSize: 11 }}
          >{`Copy ${asset.symbol} token address`}</Text>
          {fromTokenAddress && (
            <View style={{ paddingLeft: 4 }}>
              <CopyTokenAddressButton
                blockChain={fromBlockChain}
                value={fromTokenAddress}
              />
            </View>
          )}
          {toTokenAddress && toBlockChain !== fromBlockChain && (
            <View style={{ paddingLeft: 4 }}>
              <CopyTokenAddressButton
                blockChain={toBlockChain}
                value={toTokenAddress}
              />
            </View>
          )}
        </Row>
      )}
    </>
  )
}

export default CopyTokenAddress
