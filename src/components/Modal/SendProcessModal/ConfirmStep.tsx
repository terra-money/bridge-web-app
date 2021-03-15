import { ReactElement } from 'react'
import styled from 'styled-components'
import { ArrowRight } from 'react-bootstrap-icons'
import { Col, Row } from 'react-bootstrap'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { ASSET, COLOR, NETWORK, STYLE } from 'consts'

import { Text } from 'components'
import Button from 'components/Button'
import FormImage from 'components/FormImage'

import SendStore from 'store/SendStore'
import SendProcessStore, { ProcessStatus } from 'store/SendProcessStore'

import useAsset from 'hooks/useAsset'

import { BlockChainType } from 'types/network'
import { AssetNativeDenomEnum } from 'types/asset'

const StyledContainer = styled.div`
  padding: 0;
`

const StyledFromToBlockChainBox = styled.div`
  border-radius: ${STYLE.css.borderRadius};
  box-shadow: rgba(0, 0, 0, 0.5) 0px 5px 10px;
  padding: 20px;
  margin: 20px 0;
`

const StyledSection = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 12px;
  word-break: break-all;
`

const StyledSecH = styled.div`
  display: inline-block;
  color: ${COLOR.skyGray};
  white-space: nowrap;
`

const StyledSecD = styled.div`
  display: inline-block;
  text-align: right;
  padding-left: 10px;
`

const StyledSecDText = styled(Text)<{ isError?: boolean }>`
  color: ${(props): string => (props.isError ? 'red' : COLOR.text)};
`

const ConfirmStep = (): ReactElement => {
  const setStatus = useSetRecoilState(SendProcessStore.sendProcessStatus)
  const { formatBalance } = useAsset()

  // Send Data
  const asset = useRecoilValue(SendStore.asset)
  const toAddress = useRecoilValue(SendStore.toAddress)
  const amount = useRecoilValue(SendStore.amount)
  const memo = useRecoilValue(SendStore.memo)
  const toBlockChain = useRecoilValue(SendStore.toBlockChain)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)

  // Computed data from Send data
  const feeOfGas = useRecoilValue(SendStore.feeOfGas)
  const tax = useRecoilValue(SendStore.tax)
  const feeDenom = useRecoilValue<AssetNativeDenomEnum>(SendStore.feeDenom)
  const shuttleFee = useRecoilValue(SendStore.shuttleFee)
  const amountAfterShuttleFee = useRecoilValue(SendStore.amountAfterShuttleFee)

  return (
    <StyledContainer>
      <div style={{ textAlign: 'center' }}>
        <Text
          style={{ fontSize: 22, letterSpacing: -0.5, wordBreak: 'break-all' }}
        >
          {formatBalance(amount)} {asset?.symbol}
        </Text>
      </div>
      <StyledFromToBlockChainBox>
        <Row>
          <Col style={{ textAlign: 'center' }}>
            <div style={{ paddingBottom: 5 }}>
              <Text style={{ color: COLOR.skyGray, fontSize: 10 }}>From</Text>
            </div>

            <FormImage
              src={NETWORK.blockChainImage[fromBlockChain]}
              size={36}
            />

            <div style={{ fontSize: 14 }}>
              <Text>{NETWORK.blockChainName[fromBlockChain]}</Text>
            </div>
          </Col>
          <Col
            xs={1}
            style={{
              textAlign: 'center',
              alignSelf: 'center',
              paddingLeft: 0,
              paddingRight: 0,
            }}
          >
            <ArrowRight color={COLOR.white} size={20} />
          </Col>
          <Col style={{ textAlign: 'center' }}>
            <div style={{ paddingBottom: 5 }}>
              <Text style={{ color: COLOR.skyGray, fontSize: 10 }}>To</Text>
            </div>

            <FormImage src={NETWORK.blockChainImage[toBlockChain]} size={36} />

            <div style={{ fontSize: 14 }}>
              <Text>{NETWORK.blockChainName[toBlockChain]}</Text>
            </div>
          </Col>
        </Row>
      </StyledFromToBlockChainBox>

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
        <StyledSection>
          <StyledSecH>NetworkFee</StyledSecH>
          <StyledSecD>
            <div>
              <StyledSecDText style={{ paddingRight: 5 }}>
                GAS Fee:
              </StyledSecDText>
              <StyledSecDText style={{ paddingRight: 5 }}>
                {formatBalance(feeOfGas || '0')}
              </StyledSecDText>
              <StyledSecDText>{ASSET.symbolOfDenom[feeDenom]}</StyledSecDText>
            </div>

            {tax && (
              <StyledSecDText>
                Tax: {formatBalance(tax)} {asset?.symbol}
              </StyledSecDText>
            )}
            {shuttleFee &&
              (toBlockChain === BlockChainType.ethereum ||
                toBlockChain === BlockChainType.bsc) && (
                <div>
                  <StyledSecDText>
                    {`Shuttle fee (estimated) : ${formatBalance(shuttleFee)} ${
                      asset?.symbol
                    }`}
                  </StyledSecDText>
                </div>
              )}
          </StyledSecD>
        </StyledSection>
      )}

      <StyledSection>
        <StyledSecH>You will receive :</StyledSecH>
        <StyledSecD>
          {fromBlockChain === BlockChainType.terra &&
          (toBlockChain === BlockChainType.ethereum ||
            toBlockChain === BlockChainType.bsc) ? (
            <div>
              <StyledSecDText
                isError={amountAfterShuttleFee.isLessThanOrEqualTo(0)}
              >
                {` (estimated) ${formatBalance(amountAfterShuttleFee)} ${
                  asset?.symbol
                }`}
              </StyledSecDText>
            </div>
          ) : (
            <StyledSecDText>{`${formatBalance(amount)} ${
              asset?.symbol
            }`}</StyledSecDText>
          )}
        </StyledSecD>
      </StyledSection>
      <br />
      <Button
        onClick={(): void => {
          setStatus(ProcessStatus.Submit)
        }}
      >
        Confirm
      </Button>
    </StyledContainer>
  )
}

export default ConfirmStep
