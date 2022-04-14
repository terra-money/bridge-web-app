import SendStore from 'store/SendStore'
import { useRecoilState, useRecoilValue } from 'recoil'
import { BlockChainType, availableBridges } from 'types'

export default function useUpdateBridgeType(): void {
  const toBlockChain = useRecoilValue(SendStore.toBlockChain)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)
  const [bridgeUsed, setBridgeUSed] = useRecoilState(SendStore.bridgeUsed)

  const chain =
    toBlockChain === BlockChainType.terra ? fromBlockChain : toBlockChain

  if (!bridgeUsed || !availableBridges[chain].includes(bridgeUsed))
    setBridgeUSed(availableBridges[chain][0])
}
