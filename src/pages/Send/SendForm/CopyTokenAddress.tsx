import { ReactElement, useMemo } from 'react'
import { useRecoilValue } from 'recoil'

import SendStore from 'store/SendStore'
import { Text, View, Row, CopyTokenAddressButton } from 'components'
import ContractStore from 'store/ContractStore'
import { BlockChainType } from 'types/network'

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
    tokenAddress: string
  ): string => {
    switch (blockChain) {
      case BlockChainType.terra:
        return terraWhiteList[tokenAddress]
      case BlockChainType.ethereum:
        return ethWhiteList[tokenAddress]
      case BlockChainType.bsc:
        return bscWhiteList[tokenAddress]
      case BlockChainType.hmy:
        return hmyWhiteList[tokenAddress]
    }
  }

  const fromTokenAddress = useMemo(
    () => asset && getTokenAddress(fromBlockChain, asset.tokenAddress),
    [asset]
  )
  const toTokenAddress = useMemo(
    () => asset && getTokenAddress(toBlockChain, asset.tokenAddress),
    [asset]
  )

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
