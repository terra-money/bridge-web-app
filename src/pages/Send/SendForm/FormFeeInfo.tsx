import { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import _ from 'lodash'

import { ASSET, COLOR, UTIL } from 'consts'

import { BlockChainType, BridgeType } from 'types/network'
import { ValidateItemResultType } from 'types/send'
import { AssetNativeDenomEnum, AssetSymbolEnum } from 'types/asset'

import { Text, View, Row } from 'components'
import FormLabel from 'components/FormLabel'
import FormSelect from 'components/FormSelect'
import FormErrorMessage from 'components/FormErrorMessage'

import useAsset from 'hooks/useAsset'

import AuthStore from 'store/AuthStore'
import SendStore from 'store/SendStore'

const StyledFormSection = styled(View)`
  margin-bottom: 40px;
`

const FormFeeInfo = ({
  feeValidationResult,
}: {
  feeValidationResult: ValidateItemResultType
}): ReactElement => {
  const isLoggedIn = useRecoilValue(AuthStore.isLoggedIn)

  // Send Data
  const asset = useRecoilValue(SendStore.asset)

  // Computed data from Send data
  const gasFeeList = useRecoilValue(SendStore.gasFeeList)
  const [gasFee, setGasFee] = useRecoilState(SendStore.gasFee)
  const setFee = useSetRecoilState(SendStore.fee)

  const [feeDenom, setFeeDenom] = useRecoilState<AssetNativeDenomEnum>(
    SendStore.feeDenom
  )
  const bridgeFee = useRecoilValue(SendStore.bridgeFee)
  const amountAfterBridgeFee = useRecoilValue(SendStore.amountAfterBridgeFee)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)
  const validationResult = useRecoilValue(SendStore.validationResult)
  const bridgeUsed = useRecoilValue(SendStore.bridgeUsed)

  const assetList = useRecoilValue(SendStore.loginUserAssetList)

  const { formatBalance } = useAsset()

  const [optionList, setOptionList] = useState<
    {
      label: AssetSymbolEnum
      value: AssetNativeDenomEnum
      isDisabled?: boolean
    }[]
  >([])

  const setStdFee = (props: { feeDenom: AssetNativeDenomEnum }): void => {
    const stdFee = gasFeeList.find((x) => x.denom === props.feeDenom)?.fee
    const value = stdFee?.amount
      .toArray()
      .find((x) => x.denom === feeDenom)
      ?.amount.toString()

    setGasFee(UTIL.toBignumber(value))
    setFee(stdFee)
  }

  const getDefaultOptionList = (): {
    label: AssetSymbolEnum
    value: AssetNativeDenomEnum
    isDisabled: boolean
  }[] => {
    return _.map(gasFeeList, ({ denom, fee }) => {
      let isDisabled = true
      if (fee) {
        const ownedAmount = UTIL.toBignumber(
          assetList.find((x) => x.terraToken === denom)?.balance
        )

        const feeAmount = UTIL.toBignumber(
          fee.amount.toArray()[0].amount.toString()
        )

        isDisabled = ownedAmount.isLessThan(feeAmount)
      }

      return {
        label: ASSET.symbolOfDenom[denom],
        value: denom,
        isDisabled,
      }
    })
  }

  useEffect(() => {
    setStdFee({ feeDenom })
  }, [feeDenom])

  // disable feeDenom what has no balance
  useEffect(() => {
    if (assetList.length > 0) {
      const defaultOptionList = getDefaultOptionList()

      setOptionList(defaultOptionList)

      const selected = defaultOptionList.find((x) => x.value === feeDenom)
      const selectable = defaultOptionList.find((x) => x.isDisabled === false)
      if (selected?.isDisabled && selectable) {
        setFeeDenom(selectable.value)
        setStdFee({ feeDenom: selectable.value })
      } else {
        setStdFee({ feeDenom })
      }
    }
  }, [gasFeeList])

  return (
    <>
      {isLoggedIn &&
        fromBlockChain === BlockChainType.terra &&
        validationResult.isValid && (
          <StyledFormSection>
            <FormLabel title={'TxFee'} />

            <View
              style={{
                marginTop: 12,
                borderTop: 'dashed 1px #444',

                fontSize: 12,
                paddingTop: 6,
                paddingBottom: 6,
              }}
            >
              <Row
                style={{
                  paddingTop: 6,
                  paddingBottom: 6,
                  margin: 0,
                  justifyContent: 'space-between',
                }}
              >
                <View>
                  <Text style={{ paddingRight: 10, color: COLOR.skyGray }}>
                    GAS Fee
                  </Text>
                </View>
                <Row style={{ alignItems: 'center' }}>
                  <Text
                    style={{
                      justifyContent: 'flex-end',
                      paddingRight: 10,
                      opacity: 0.8,
                    }}
                  >
                    {formatBalance(gasFee)}
                  </Text>
                  <FormSelect
                    selectedValue={feeDenom}
                    size={'sm'}
                    optionList={optionList}
                    onSelect={(value: AssetNativeDenomEnum): void => {
                      setFeeDenom(value)
                    }}
                    containerStyle={{
                      width: 52,
                      height: 26,
                      borderRadius: 3,
                      padding: '6px 5px 5px 8px',
                    }}
                    selectedTextStyle={{
                      fontSize: 12,
                      fontWeight: 'normal',
                      letterSpacing: -0.19,
                    }}
                    menuContainerStyle={{
                      borderRadius: 3,
                    }}
                  />
                </Row>
              </Row>
              <View style={{ justifyContent: 'flex-end' }}>
                <FormErrorMessage
                  errorMessage={feeValidationResult.errorMessage}
                />
              </View>

              {(bridgeUsed === BridgeType.shuttle ||
                bridgeUsed === BridgeType.axelar ||
                bridgeUsed === BridgeType.wormhole) && (
                <>
                  <Row
                    style={{
                      paddingTop: 6,
                      paddingBottom: 12,
                      margin: 0,
                      justifyContent: 'space-between',
                    }}
                  >
                    <View>
                      <Text style={{ paddingRight: 10, color: COLOR.skyGray }}>
                        {bridgeUsed.charAt(0).toUpperCase() +
                          bridgeUsed.slice(1)}{' '}
                        fee (estimated)
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{ justifyContent: 'flex-end', opacity: '0.8' }}
                      >
                        {`${formatBalance(bridgeFee)} ${asset?.symbol}`}
                      </Text>
                    </View>
                  </Row>
                  <Row
                    style={{
                      paddingTop: 12,
                      margin: 0,
                      borderTop: 'solid 1px #2e2e2e',
                      justifyContent: 'space-between',
                    }}
                  >
                    <View>
                      <Text style={{ paddingRight: 10, color: COLOR.skyGray }}>
                        Amount after{' '}
                        {bridgeUsed.charAt(0).toUpperCase() +
                          bridgeUsed.slice(1)}{' '}
                        fee (estimated){' '}
                      </Text>
                    </View>
                    <View style={{ padding: 0, alignItems: 'flex-start' }}>
                      <Text
                        style={{
                          justifyContent: 'flex-end',
                          opacity: '0.8',
                          color: amountAfterBridgeFee.isLessThanOrEqualTo(0)
                            ? COLOR.red
                            : COLOR.text,
                        }}
                      >
                        {`${formatBalance(amountAfterBridgeFee)} ${
                          asset?.symbol
                        }`}
                      </Text>
                    </View>
                  </Row>
                </>
              )}
            </View>
          </StyledFormSection>
        )}
    </>
  )
}

export default FormFeeInfo
