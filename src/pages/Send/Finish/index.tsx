import { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import _ from 'lodash'
import { BoxArrowUpRight } from 'react-bootstrap-icons'

import { UTIL, NETWORK, COLOR } from 'consts'

import { ExtLink, Text } from 'components'

import SendStore from 'store/SendStore'

import useAsset from 'hooks/useAsset'

import SendProcessStore from 'store/SendProcessStore'
import useNetwork from 'hooks/useNetwork'
import AuthStore from 'store/AuthStore'
import FormImage from 'components/FormImage'
import { BlockChainType } from 'types/network'

const StyledContainer = styled.div`
  padding-top: 20px;
  padding-bottom: 40px;
`

const StyledSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  word-break: break-all;
`

const StyledSecH = styled.div`
  display: inline-block;
  color: ${COLOR.white};
  white-space: nowrap;
  opacity: 0.6;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.25;
  letter-spacing: -0.19px;
`

const StyledSecD = styled.div`
  display: inline-block;
  text-align: right;
  padding-left: 10px;
`

const StyledSecDText = styled(Text)<{ isError?: boolean }>`
  color: ${(props): string => (props.isError ? COLOR.red : COLOR.text)};
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.19px;
  text-align: right;
`

const StyledInfoText = styled(Text)`
  white-space: pre-wrap;
  text-align: center;
  display: block;
  margin-bottom: 46px;
  font-size: 12px;
  color: ${COLOR.skyGray};
`

const StyledAmountText = styled(Text)<{ isError?: boolean }>`
  color: ${(props): string => (props.isError ? COLOR.red : COLOR.text)};
`
const Finish = (): ReactElement => {
  const { formatBalance } = useAsset()
  const loginUser = useRecoilValue(AuthStore.loginUser)

  // Send Data
  const asset = useRecoilValue(SendStore.asset)
  const [toAddress, setToAddress] = useRecoilState(SendStore.toAddress)
  const [amount, setAmount] = useRecoilState(SendStore.amount)
  const setMemo = useSetRecoilState(SendStore.memo)
  const toBlockChain = useRecoilValue(SendStore.toBlockChain)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)

  const [requestTxResult, setRequestTxResult] = useRecoilState(
    SendProcessStore.requestTxResult
  )
  const [waitForReceiptError, setWaitForReceiptError] = useRecoilState(
    SendProcessStore.waitForReceiptError
  )
  const amountAfterShuttleFee = useRecoilValue(SendStore.amountAfterShuttleFee)

  const { getScannerLink } = useNetwork()

  const [displayAmount] = useState(amount)
  const [displayToAddress] = useState(toAddress)
  const [displayRequestTxResult] = useState(requestTxResult)
  const [displayErrorMessage] = useState(waitForReceiptError)

  useEffect(() => {
    setToAddress('')
    setAmount('')
    setMemo('')
    setRequestTxResult({ success: false })
    setWaitForReceiptError('')
  }, [])

  return (
    <StyledContainer>
      {_.some(displayErrorMessage) ? (
        <StyledInfoText style={{ color: COLOR.red }}>
          {displayErrorMessage}
        </StyledInfoText>
      ) : (
        <StyledInfoText>
          {`Transferring ${asset?.symbol} from ${NETWORK.blockChainName[fromBlockChain]} Network to ${NETWORK.blockChainName[toBlockChain]} Network.\nTransaction will be submitted via ${loginUser.walletType}`}
        </StyledInfoText>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          paddingBottom: 15,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <FormImage src={asset?.logoURI || ''} size={24} />
          <Text
            style={{
              fontSize: 22,
              paddingLeft: 10,
              letterSpacing: -0.5,
              wordBreak: 'break-all',
            }}
          >
            {formatBalance(displayAmount)} {asset?.symbol}
          </Text>
        </div>
        {fromBlockChain === BlockChainType.terra &&
          NETWORK.isEtherBaseBlockChain(toBlockChain) && (
            <div
              style={{
                fontSize: 12,
                textAlign: 'center',
                marginBottom: 20,
                marginTop: 10,
              }}
            >
              <StyledAmountText
                isError={amountAfterShuttleFee.isLessThanOrEqualTo(0)}
              >
                {`After Shuttle Fee : (estimated) ${formatBalance(
                  amountAfterShuttleFee
                )} ${asset?.symbol}`}
              </StyledAmountText>
            </div>
          )}
      </div>
      <StyledSection>
        <StyledSecH>Destination Address</StyledSecH>
        <StyledSecD>
          <StyledSecDText>
            {UTIL.truncate(displayToAddress, [10, 10])}
          </StyledSecDText>
        </StyledSecD>
      </StyledSection>

      {displayRequestTxResult?.success && (
        <StyledSection>
          <StyledSecH style={{ color: '#5592f7', opacity: 1 }}>TX</StyledSecH>
          <StyledSecD>
            <StyledSecDText>
              {
                <ExtLink
                  href={getScannerLink({
                    address: displayRequestTxResult.hash,
                    type: 'tx',
                  })}
                  style={{ padding: 0, display: 'flex', alignItems: 'center' }}
                >
                  <div>
                    {UTIL.truncate(displayRequestTxResult.hash, [10, 10])}
                  </div>
                  <BoxArrowUpRight
                    color="#5592f7"
                    size={12}
                    style={{ paddingLeft: 3, marginTop: -2 }}
                  />
                </ExtLink>
              }
            </StyledSecDText>
          </StyledSecD>
        </StyledSection>
      )}
    </StyledContainer>
  )
}

export default Finish
