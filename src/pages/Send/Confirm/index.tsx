import { ReactElement } from 'react'
import styled from 'styled-components'
import { useRecoilValue } from 'recoil'

import { ASSET, UTIL, COLOR } from 'consts'

import { ExtLink, Text } from 'components'
import FormImage from 'components/FormImage'

import SendStore from 'store/SendStore'

import useAsset from 'hooks/useAsset'

import { BlockChainType } from 'types/network'
import { AssetNativeDenomEnum } from 'types/asset'
import SendProcessStore from 'store/SendProcessStore'
import useNetwork from 'hooks/useNetwork'

const StyledContainer = styled.div`
  padding-top: 20px;
`

const StyledSection = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  word-break: break-all;
`

const StyledSecH = styled.div`
  display: inline-block;
  color: ${COLOR.white};
  white-space: nowrap;
  opacity: 0.6;
  font-family: Gotham;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.25;
  letter-spacing: -0.28px;
`

const StyledSecD = styled.div`
  display: inline-block;
  text-align: right;
  padding-left: 10px;
`

const StyledSecDText = styled(Text)<{ isError?: boolean }>`
  color: ${(props): string => (props.isError ? 'red' : COLOR.text)};
  font-family: Gotham;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: -0.37px;
`

const StyledSecDText2 = styled(Text)`
  font-family: Gotham;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.19px;
  text-align: right;
  color: #ffffff;
`

const StyledSpaceBetween = styled.div`
  width: 100%;
  justify-content: space-between;
  display: flex;
`

const Confirm = (): ReactElement => {
  const { formatBalance } = useAsset()

  // Send Data
  const asset = useRecoilValue(SendStore.asset)
  const toAddress = useRecoilValue(SendStore.toAddress)
  const amount = useRecoilValue(SendStore.amount)
  const memo = useRecoilValue(SendStore.memo)
  const toBlockChain = useRecoilValue(SendStore.toBlockChain)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)

  // Computed data from Send data
  const gasFee = useRecoilValue(SendStore.gasFee)
  const tax = useRecoilValue(SendStore.tax)
  const feeDenom = useRecoilValue<AssetNativeDenomEnum>(SendStore.feeDenom)
  const shuttleFee = useRecoilValue(SendStore.shuttleFee)
  const amountAfterShuttleFee = useRecoilValue(SendStore.amountAfterShuttleFee)

  const requestTxResult = useRecoilValue(SendProcessStore.requestTxResult)

  const { getScannerLink } = useNetwork()

  return (
    <StyledContainer>
      <StyledSection>
        <StyledSecH>Asset</StyledSecH>
        <StyledSecD>
          <div style={{ alignItems: 'center', textAlign: 'right' }}>
            <span style={{ marginRight: 8, verticalAlign: 'middle' }}>
              <FormImage src={asset?.loguURI || ''} size={16} />
            </span>
            <StyledSecDText>{asset?.symbol}</StyledSecDText>
          </div>
        </StyledSecD>
      </StyledSection>

      {fromBlockChain === BlockChainType.terra &&
        toBlockChain === BlockChainType.terra && (
          <StyledSection>
            <StyledSecH>Memo</StyledSecH>
            <StyledSecD>
              <Text>{memo}</Text>
            </StyledSecD>
          </StyledSection>
        )}
      <StyledSection>
        <StyledSecH>Destination</StyledSecH>
        <StyledSecD>
          <StyledSecDText>{toAddress}</StyledSecDText>
        </StyledSecD>
      </StyledSection>

      {fromBlockChain === BlockChainType.terra && (
        <StyledSection style={{ flexDirection: 'column' }}>
          {tax && (
            <StyledSpaceBetween style={{ marginBottom: 12 }}>
              <StyledSecH>Tax</StyledSecH>
              <StyledSecD>
                <StyledSecDText2>
                  {formatBalance(tax.amount.toString())} {asset?.symbol}
                </StyledSecDText2>
              </StyledSecD>
            </StyledSpaceBetween>
          )}
          <StyledSpaceBetween style={{ marginBottom: 12 }}>
            <StyledSecH>GAS Fee</StyledSecH>
            <StyledSecD>
              <StyledSecDText2 style={{ paddingRight: 5 }}>
                {formatBalance(gasFee)}
              </StyledSecDText2>
              <StyledSecDText2>{ASSET.symbolOfDenom[feeDenom]}</StyledSecDText2>
            </StyledSecD>
          </StyledSpaceBetween>

          {shuttleFee &&
            (toBlockChain === BlockChainType.ethereum ||
              toBlockChain === BlockChainType.bsc) && (
              <StyledSpaceBetween>
                <StyledSecH>Shuttle fee (estimated)</StyledSecH>
                <StyledSecD>
                  <StyledSecDText2>
                    {`${formatBalance(shuttleFee)} ${asset?.symbol}`}
                  </StyledSecDText2>
                </StyledSecD>
              </StyledSpaceBetween>
            )}
        </StyledSection>
      )}

      <StyledSection>
        {fromBlockChain === BlockChainType.terra &&
        (toBlockChain === BlockChainType.ethereum ||
          toBlockChain === BlockChainType.bsc) ? (
          <StyledSpaceBetween>
            <StyledSecH>After Shuttle Fee (estimated)</StyledSecH>
            <StyledSecD>
              <StyledSecDText
                isError={amountAfterShuttleFee.isLessThanOrEqualTo(0)}
              >
                {`${formatBalance(amountAfterShuttleFee)} ${asset?.symbol}`}
              </StyledSecDText>
            </StyledSecD>
          </StyledSpaceBetween>
        ) : (
          <StyledSpaceBetween>
            <StyledSecH>Receive amount</StyledSecH>
            <StyledSecD>
              <StyledSecDText>{`${formatBalance(amount)} ${
                asset?.symbol
              }`}</StyledSecDText>
            </StyledSecD>
          </StyledSpaceBetween>
        )}
      </StyledSection>

      {requestTxResult?.success && (
        <StyledSection>
          <StyledSecH>TX</StyledSecH>
          <StyledSecD>
            <StyledSecDText>
              {
                <ExtLink
                  href={getScannerLink({
                    address: requestTxResult.hash,
                    type: 'tx',
                  })}
                >
                  {UTIL.truncate(requestTxResult.hash, [15, 15])}
                </ExtLink>
              }
            </StyledSecDText>
          </StyledSecD>
        </StyledSection>
      )}
    </StyledContainer>
  )
}

export default Confirm
