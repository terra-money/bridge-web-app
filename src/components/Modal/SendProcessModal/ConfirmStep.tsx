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
  box-shadow: rgb(11 14 17) 0px 2px 8px;
  background: rgb(30, 32, 38);
  padding: 12px 32px;
`

const StyledSection = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid ${COLOR.skyGray};
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

const ConfirmScreen = (): ReactElement => {
  const setStatus = useSetRecoilState(SendProcessStore.sendProcessStatus)
  const { formatBalace } = useAsset()

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
        <Text style={{ fontSize: 40 }}>
          {formatBalace(amount)} {asset?.symbol}
        </Text>
      </div>
      <StyledFromToBlockChainBox>
        <Row>
          <Col style={{ textAlign: 'center' }}>
            <div style={{ paddingBottom: 5 }}>
              <Text style={{ color: COLOR.skyGray }}>From</Text>
            </div>

            <FormImage
              src={NETWORK.blockChainImage[fromBlockChain]}
              size={40}
            />

            <div style={{ paddingTop: 10 }}>
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
            <ArrowRight color={COLOR.white} />
          </Col>
          <Col style={{ textAlign: 'center' }}>
            <div style={{ paddingBottom: 5 }}>
              <Text style={{ color: COLOR.skyGray }}>To</Text>
            </div>

            <FormImage src={NETWORK.blockChainImage[toBlockChain]} size={40} />

            <div style={{ paddingTop: 10 }}>
              <Text>{NETWORK.blockChainName[toBlockChain]}</Text>
            </div>
          </Col>
        </Row>
      </StyledFromToBlockChainBox>

      <StyledSection>
        <StyledSecH>Asset :</StyledSecH>
        <StyledSecD>
          <div style={{ alignItems: 'center', textAlign: 'right' }}>
            <span style={{ marginRight: 10 }}>
              <FormImage src={asset?.loguURI || ''} size={16} />
            </span>
            <Text>{asset?.symbol}</Text>
          </div>
        </StyledSecD>
      </StyledSection>

      {fromBlockChain === BlockChainType.terra &&
        toBlockChain === BlockChainType.terra && (
          <StyledSection>
            <StyledSecH>Memo :</StyledSecH>
            <StyledSecD>
              <Text>{memo}</Text>
            </StyledSecD>
          </StyledSection>
        )}
      <StyledSection>
        <StyledSecH>Destination :</StyledSecH>
        <StyledSecD>
          <span style={{ marginRight: 10 }}>
            <FormImage src={NETWORK.blockChainImage[toBlockChain]} size={16} />
          </span>
          <Text>{toAddress}</Text>
        </StyledSecD>
      </StyledSection>

      {fromBlockChain === BlockChainType.terra ? (
        <>
          <StyledSection>
            <StyledSecH>NetworkFee :</StyledSecH>
            <StyledSecD>
              <div>
                <Text style={{ paddingRight: 10 }}>GAS Fee :</Text>
                <Text style={{ paddingRight: 10 }}>
                  {feeOfGas ? formatBalace(feeOfGas) : '0'}
                </Text>
                <Text>{ASSET.symbolOfDenom[feeDenom]}</Text>
              </div>

              {tax && (
                <Text>
                  Tax : {formatBalace(tax)} {asset?.symbol}
                </Text>
              )}
              {shuttleFee &&
                (toBlockChain === BlockChainType.ethereum ||
                  toBlockChain === BlockChainType.bsc) && (
                  <div>
                    <Text>
                      {`Shuttle fee (estimated) : ${formatBalace(shuttleFee)} ${
                        asset?.symbol
                      }`}
                    </Text>
                  </div>
                )}
            </StyledSecD>
          </StyledSection>

          <StyledSection>
            <StyledSecH>You will receive :</StyledSecH>
            <StyledSecD>
              {toBlockChain === BlockChainType.ethereum ||
              toBlockChain === BlockChainType.bsc ? (
                <div>
                  <Text
                    style={
                      amountAfterShuttleFee.isLessThanOrEqualTo(0)
                        ? {
                            color: 'red',
                          }
                        : {}
                    }
                  >
                    {` (estimated) ${formatBalace(amountAfterShuttleFee)} ${
                      asset?.symbol
                    }`}
                  </Text>
                </div>
              ) : (
                <Text>{`${formatBalace(amount)} ${asset?.symbol}`}</Text>
              )}
            </StyledSecD>
          </StyledSection>
        </>
      ) : (
        <StyledSection>
          <StyledSecH>You will receive :</StyledSecH>
          <StyledSecD>
            <Text>{`${formatBalace(amount)} ${asset?.symbol}`}</Text>
          </StyledSecD>
        </StyledSection>
      )}
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

export default ConfirmScreen
