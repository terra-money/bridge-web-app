import { ReactElement, useMemo } from 'react'
import { useRecoilValue } from 'recoil'

import SendStore from 'store/SendStore'
import { Text, View, Row, CopyTokenAddressButton } from 'components'
import ContractStore from 'store/ContractStore'
import { BlockChainType } from 'types/network'
import { AssetSymbolEnum } from 'types/asset'

const CopyTokenAddress = (): ReactElement => {
  const asset = useRecoilValue(SendStore.asset)
  const toBlockChain = useRecoilValue(SendStore.toBlockChain)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)

  const terraWhiteList = useRecoilValue(ContractStore.terraWhiteList)
  const ethWhiteList = useRecoilValue(ContractStore.ethWhiteList)
  const bscWhiteList = useRecoilValue(ContractStore.bscWhiteList)
  const hmyWhiteList = useRecoilValue(ContractStore.hmyWhiteList)

  const getTokenAddress = (
    blockChain: BlockChainType,
    symbol: AssetSymbolEnum
  ): string => {
    switch (blockChain) {
      case BlockChainType.terra:
        return terraWhiteList[symbol]
      case BlockChainType.ethereum:
        return ethWhiteList[symbol]
      case BlockChainType.bsc:
        return bscWhiteList[symbol]
      case BlockChainType.hmy:
        return hmyWhiteList[symbol]
    }
  }

  const fromTokenAddress = useMemo(
    () => asset && getTokenAddress(fromBlockChain, asset.symbol),
    [asset]
  )
  const toTokenAddress = useMemo(
    () => asset && getTokenAddress(toBlockChain, asset.symbol),
    [asset]
  )

  return (
    <>
      {asset && (fromTokenAddress || toTokenAddress) && (
        <Row
          style={{
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingTop: 8,
          }}
        >
          <Text
            style={{ color: '#737373', fontSize: 11 }}
          >{`Copy "${asset.symbol}" token address`}</Text>
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
