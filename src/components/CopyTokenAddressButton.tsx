import { ReactElement, useState } from 'react'
import styled from 'styled-components'
import useClipboard from 'react-use-clipboard'
import { Check } from 'react-bootstrap-icons'

import { COLOR, NETWORK } from 'consts'
import copyClipboardPng from 'images/copy_clipboard.png'

import Row from './Row'
import Text from './Text'
import View from './View'
import FormImage from './FormImage'
import { BlockChainType } from 'types/network'

const StyledContainer = styled(Row)`
  cursor: pointer;
  padding: 3px 8px;
  border-radius: 10px;
  background-color: #202020;
  align-items: center;
  width: auto;
`

const CopyTokenAddressButton = ({
  blockChain,
  value,
}: {
  blockChain: BlockChainType
  value: string
}): ReactElement => {
  const [isCopied, setIsCopied] = useState(false)
  const [, setCopied] = useClipboard(value)

  return (
    <StyledContainer
      onClick={(): void => {
        if (isCopied) {
          return
        }
        setCopied()
        setIsCopied(true)
        setTimeout(() => {
          setIsCopied(false)
        }, 1500)
      }}
    >
      <View style={{ paddingRight: 4 }}>
        {isCopied ? (
          <Check size={12} color={COLOR.primary} />
        ) : (
          <FormImage src={copyClipboardPng} size={12} />
        )}
      </View>
      <Text style={{ fontSize: 11, color: '#737373', alignItems: 'center' }}>
        {NETWORK.blockChainName[blockChain]}
      </Text>
    </StyledContainer>
  )
}

export default CopyTokenAddressButton
