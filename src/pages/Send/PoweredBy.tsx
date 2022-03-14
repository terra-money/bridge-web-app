import { ReactElement } from 'react'
import { useRecoilValue } from 'recoil'
import SendStore from 'store/SendStore'
import { isIbcNetwork, isAxelarNetwork } from 'types'

export default function PoweredBy(): ReactElement {
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)
  const toBlockChain = useRecoilValue(SendStore.toBlockChain)

  // same network (terra -> terra)
  if (fromBlockChain === toBlockChain) return <></>

  // ibc transfers
  if (isIbcNetwork(toBlockChain) || isIbcNetwork(fromBlockChain)) {
    return (
      <div
        style={{
          textAlign: 'center',
          marginTop: '1.6rem',
          marginBottom: '-1.6rem',
          fontSize: 'small',
        }}
      >
        Powered by IBC
      </div>
    )
  }

  // axelar bridge
  if (isAxelarNetwork(toBlockChain) || isAxelarNetwork(fromBlockChain))
    return (
      <div
        style={{
          textAlign: 'center',
          marginTop: '1.6rem',
          marginBottom: '-1.6rem',
          fontSize: 'small',
        }}
      >
        Powered by Axelar
      </div>
    )

  // shuttle
  return (
    <div
      style={{
        textAlign: 'center',
        marginTop: '1.6rem',
        marginBottom: '-1.6rem',
        fontSize: 'small',
      }}
    >
      Powered by Terra Shuttle
    </div>
  )
}
