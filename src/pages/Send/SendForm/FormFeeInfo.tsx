import { ReactElement, useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import styled from 'styled-components'
import { useRecoilState, useRecoilValue } from 'recoil'
import _ from 'lodash'
import BigNumber from 'bignumber.js'

import { ASSET, COLOR } from 'consts'

import { BlockChainType } from 'types/network'
import { ValidateItemResultType, ValidateResultType } from 'types/send'
import { AssetNativeDenomEnum, AssetSymbolEnum } from 'types/asset'

import { Text } from 'components'
import FormLabel from 'components/FormLabel'
import FormSelect from 'components/FormSelect'
import FormErrorMessage from 'components/FormErrorMessage'

import useAsset from 'hooks/useAsset'

import AuthStore from 'store/AuthStore'
import SendStore from 'store/SendStore'

const StyledFormSection = styled.div`
  margin-bottom: 20px;
`

const FormFeeInfo = ({
  validationResult,
  isValidGasFee,
  isValidTax,
}: {
  validationResult: ValidateResultType
  isValidGasFee: ValidateItemResultType
  isValidTax: ValidateItemResultType
}): ReactElement => {
  const isLoggedIn = useRecoilValue(AuthStore.isLoggedIn)

  // Send Data
  const asset = useRecoilValue(SendStore.asset)
  const toBlockChain = useRecoilValue(SendStore.toBlockChain)

  // Computed data from Send data
  const feeOfGas = useRecoilValue(SendStore.feeOfGas)
  const tax = useRecoilValue(SendStore.tax)
  const [feeDenom, setFeeDenom] = useRecoilState<AssetNativeDenomEnum>(
    SendStore.feeDenom
  )
  const shuttleFee = useRecoilValue(SendStore.shuttleFee)
  const amountAfterShuttleFee = useRecoilValue(SendStore.amountAfterShuttleFee)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)

  const assetList = useRecoilValue(SendStore.loginUserAssetList)

  const { formatBalance } = useAsset()

  const [optionList, setOptionList] = useState<
    {
      label: AssetSymbolEnum
      value: AssetNativeDenomEnum
      isDisabled?: boolean
    }[]
  >([])

  // disable feeDenom what has no balance
  useEffect(() => {
    if (assetList.length > 0) {
      const defaultOptionList = _.map(AssetNativeDenomEnum, (denom) => {
        const ownedAmount = new BigNumber(
          assetList.find((x) => x.tokenAddress === denom)?.balance || '0'
        )
        const isDisabled = ownedAmount.isLessThanOrEqualTo(0)

        return {
          label: ASSET.symbolOfDenom[denom],
          value: denom,
          isDisabled,
        }
      })

      setOptionList(defaultOptionList)
    }
  }, [assetList])

  return (
    <>
      {isLoggedIn &&
        fromBlockChain === BlockChainType.terra &&
        validationResult.isValid && (
          <StyledFormSection>
            <FormLabel title={'TxFee'} />

            <div
              style={{
                borderTop: 'dashed 1px #444',
                borderBottom: 'dashed 1px #444',
                fontSize: 13,
              }}
            >
              <Row style={{ paddingTop: 8, paddingBottom: 8, margin: 0 }}>
                <Col style={{ padding: 0 }}>
                  <Text style={{ paddingRight: 10, color: COLOR.skyGray }}>
                    GAS Fee
                  </Text>
                </Col>
                <Col style={{ textAlign: 'right', padding: 0 }}>
                  <Text style={{ paddingRight: 10, opacity: 0.8 }}>
                    {feeOfGas ? formatBalance(feeOfGas) : '0'}
                  </Text>
                  <div className={'d-inline-block'}>
                    <FormSelect
                      defaultValue={feeDenom}
                      size={'sm'}
                      optionList={optionList}
                      onSelect={(value: AssetNativeDenomEnum): void => {
                        setFeeDenom(value)
                      }}
                    />
                  </div>
                </Col>
              </Row>
              <div style={{ textAlign: 'right' }}>
                <FormErrorMessage errorMessage={isValidGasFee.errorMessage} />
              </div>
              {tax && (
                <>
                  <Row
                    style={{
                      paddingTop: 8,
                      paddingBottom: 8,
                      margin: 0,
                      borderTop: 'solid 1px rgba(255,255,255,.03)',
                    }}
                  >
                    <Col style={{ padding: 0 }}>
                      <Text style={{ paddingRight: 10, color: COLOR.skyGray }}>
                        Tax
                      </Text>
                    </Col>
                    <Col style={{ textAlign: 'right', padding: 0 }}>
                      <Text style={{ opacity: '0.8' }}>
                        {formatBalance(tax)} {asset?.symbol}
                      </Text>
                    </Col>
                  </Row>
                  <div style={{ textAlign: 'right' }}>
                    <FormErrorMessage errorMessage={isValidTax.errorMessage} />
                  </div>
                </>
              )}

              {(toBlockChain === BlockChainType.ethereum ||
                toBlockChain === BlockChainType.bsc) && (
                <>
                  <Row
                    style={{
                      paddingTop: 8,
                      paddingBottom: 8,
                      margin: 0,
                      borderTop: 'solid 1px rgba(255,255,255,.03)',
                    }}
                  >
                    <Col style={{ padding: 0 }}>
                      <Text style={{ paddingRight: 10, color: COLOR.skyGray }}>
                        Shuttle fee (estimated)
                      </Text>
                    </Col>
                    <Col style={{ textAlign: 'right', padding: 0 }}>
                      <Text style={{ opacity: '0.8' }}>
                        {`${formatBalance(shuttleFee)} ${asset?.symbol}`}
                      </Text>
                    </Col>
                  </Row>
                  <Row
                    style={{
                      paddingTop: 8,
                      paddingBottom: 8,
                      margin: 0,
                      borderTop: 'solid 1px rgba(255,255,255,.03)',
                    }}
                  >
                    <Col style={{ padding: 0 }}>
                      <Text style={{ paddingRight: 10, color: COLOR.skyGray }}>
                        Amount after Shuttle fee (estimated){' '}
                      </Text>
                    </Col>
                    <Col style={{ textAlign: 'right', padding: 0 }}>
                      <Text
                        style={{
                          opacity: '0.8',
                          color: amountAfterShuttleFee.isLessThanOrEqualTo(0)
                            ? COLOR.red
                            : COLOR.text,
                        }}
                      >
                        {`${formatBalance(amountAfterShuttleFee)} ${
                          asset?.symbol
                        }`}
                      </Text>
                    </Col>
                  </Row>
                </>
              )}
            </div>
          </StyledFormSection>
        )}
    </>
  )
}

export default FormFeeInfo