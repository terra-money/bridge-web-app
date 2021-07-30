import { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import _ from 'lodash'
import { useDebouncedCallback } from 'use-debounce'
import BigNumber from 'bignumber.js'
import { ArrowClockwise } from 'react-bootstrap-icons'

import { ASSET, COLOR, NETWORK } from 'consts'

import { BlockChainType } from 'types/network'
import { ValidateItemResultType } from 'types/send'
import { AssetNativeDenomEnum } from 'types/asset'

import { Text, Row } from 'components'
import FormLabel from 'components/FormLabel'
import FormErrorMessage from 'components/FormErrorMessage'
import FormLabelInput from 'components/FormLabelInput'

import useSend from 'hooks/useSend'
import useShuttle from 'hooks/useShuttle'
import useSendValidate from 'hooks/useSendValidate'
import useAsset from 'hooks/useAsset'

import AuthStore from 'store/AuthStore'
import SendStore from 'store/SendStore'

import AssetList from './AssetList'
import CopyTokenAddress from './CopyTokenAddress'
import FormFeeInfo from './FormFeeInfo'
import WarningInfo from './WarningInfo'

const StyledContainer = styled.div``

const StyledFormSection = styled.div`
  margin-bottom: 40px;
`

const StyledMaxButton = styled.div`
  position: absolute;
  top: 50%;
  margin-top: -13px;
  right: 0;
  background-color: ${COLOR.darkGray2};
  font-size: 12px;
  border-radius: 5px;
  padding: 0 10px;
  line-height: 24px;
  height: 26px;

  cursor: pointer;
  :hover {
    background-color: #323842;
  }
`

const StyledRefreshButton = styled.div<{ refreshing: boolean }>`
  display: flex;
  align-items: center;
  color: ${COLOR.primary};
  font-size: 12px;
  font-weight: bold;
  opacity: ${({ refreshing }): number => (refreshing ? 0.5 : 1)};
  cursor: ${({ refreshing }): string => (refreshing ? 'default' : 'pointer')};
  user-select: none;
`

const RefreshButton = (): ReactElement => {
  const isLoggedIn = useRecoilValue(AuthStore.isLoggedIn)
  const { getAssetList } = useAsset()
  const [refreshing, setRefreshing] = useState(false)
  const dbcRefresh = useDebouncedCallback(() => {
    setRefreshing(true)
    getAssetList().finally((): void => {
      setTimeout(() => {
        setRefreshing(false)
      }, 500)
    })
  }, 300)

  return (
    <>
      {isLoggedIn && (
        <StyledRefreshButton
          onClick={(): void => {
            dbcRefresh.callback()
          }}
          refreshing={refreshing}
        >
          <ArrowClockwise style={{ marginRight: 5 }} size={14} />
          <Text
            style={{
              fontWeight: 500,
              fontSize: 10,
              color: COLOR.terraSky,
            }}
          >
            {refreshing ? 'REFRESHING...' : 'REFRESH'}
          </Text>
        </StyledRefreshButton>
      )}
    </>
  )
}

const SendForm = ({
  feeValidationResult,
}: {
  feeValidationResult: ValidateItemResultType
}): ReactElement => {
  const loginUser = useRecoilValue(AuthStore.loginUser)
  const isLoggedIn = useRecoilValue(AuthStore.isLoggedIn)

  // Send Data
  const asset = useRecoilValue(SendStore.asset)
  const [toAddress, setToAddress] = useRecoilState(SendStore.toAddress)
  const [amount, setAmount] = useRecoilState(SendStore.amount)
  const [memo, setMemo] = useRecoilState(SendStore.memo)
  const toBlockChain = useRecoilValue(SendStore.toBlockChain)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)

  // Computed data from Send data
  const setTax = useSetRecoilState(SendStore.tax)
  const setGasFeeList = useSetRecoilState(SendStore.gasFeeList)
  const feeDenom = useRecoilValue<AssetNativeDenomEnum>(SendStore.feeDenom)
  const setShuttleFee = useSetRecoilState(SendStore.shuttleFee)
  const setAmountAfterShuttleFee = useSetRecoilState(
    SendStore.amountAfterShuttleFee
  )

  const [validationResult, setValidationResult] = useRecoilState(
    SendStore.validationResult
  )

  const [inputAmount, setInputAmount] = useState('')

  const { getTerraShuttleFee } = useShuttle()
  const { formatBalance, getAssetList } = useAsset()
  const { getTerraFeeList, getTerraSendTax } = useSend()
  const { validateSendData } = useSendValidate()

  const onChangeToAddress = ({ value }: { value: string }): void => {
    setToAddress(value)
  }

  const onChangeAmount = ({ value }: { value: string }): void => {
    if (_.isEmpty(value)) {
      setInputAmount('')
      setAmount('')
      return
    }

    if (false === _.isNaN(_.toNumber(value))) {
      setInputAmount(value)
      const decimalSize = new BigNumber(
        fromBlockChain === 'terra'
          ? ASSET.TERRA_DECIMAL
          : ASSET.ETHER_BASE_DECIMAL
      )
      setAmount(new BigNumber(value).times(decimalSize).toString(10))
    }
  }

  const onChangeMemo = ({ value }: { value: string }): void => {
    setMemo(value)
  }

  const onClickMaxButton = async (): Promise<void> => {
    const assetAmount = new BigNumber(asset?.balance || 0)
    const terraTax = await getTerraSendTax({
      denom: asset?.terraToken as AssetNativeDenomEnum,
      feeDenom,
      amount: assetAmount.toString(10),
    })
    const taxAmount = new BigNumber(terraTax?.amount.toString() || 0)

    onChangeAmount({ value: formatBalance(assetAmount.minus(taxAmount)) })
  }

  const setTerraShuttleFee = async (): Promise<void> => {
    // get terra shutte Fee Info
    if (NETWORK.isEtherBaseBlockChain(toBlockChain)) {
      const sendAmount = new BigNumber(amount)
      if (sendAmount.isGreaterThan(0)) {
        getTerraShuttleFee({
          denom: asset?.terraToken || '',
          amount: sendAmount,
        }).then((shuttleFee) => {
          setShuttleFee(shuttleFee)
          const computedAmount = sendAmount.minus(shuttleFee)
          setAmountAfterShuttleFee(
            computedAmount.isGreaterThan(0) ? computedAmount : new BigNumber(0)
          )
        })
      } else {
        setShuttleFee(new BigNumber(0))
      }
    }
  }

  // It's for Fee(gas), Tax and ShuttleFee
  const dbcGetFeeInfoWithValidation = useDebouncedCallback(async () => {
    const sendDataResult = validateSendData()
    setValidationResult(sendDataResult)

    const ableToGetFeeInfo =
      isLoggedIn &&
      fromBlockChain === BlockChainType.terra &&
      amount &&
      feeDenom &&
      toAddress

    if (asset?.terraToken && ableToGetFeeInfo) {
      if (sendDataResult.isValid) {
        // get terra Send Fee Info
        const terraFeeList = await getTerraFeeList()
        setGasFeeList(terraFeeList)
      }

      const terraTax = await getTerraSendTax({
        denom: asset?.terraToken as AssetNativeDenomEnum,
        feeDenom,
        amount,
      })
      setTax(terraTax)

      setTerraShuttleFee()
    }
  }, 300)

  //get terra send fee info
  useEffect(() => {
    dbcGetFeeInfoWithValidation.callback()
    return (): void => {
      dbcGetFeeInfoWithValidation.cancel()
    }
  }, [amount, toAddress, toBlockChain, memo, asset])

  useEffect(() => {
    onChangeAmount({ value: inputAmount })
    getAssetList().then((): void => {
      dbcGetFeeInfoWithValidation.callback()
    })
  }, [
    // to check decimal length by network
    loginUser,
    // to check if asset valid by network
    toBlockChain,
  ])

  return (
    <StyledContainer>
      <StyledFormSection>
        <Row style={{ justifyContent: 'space-between' }}>
          <FormLabel title={'Asset'} />
          <RefreshButton />
        </Row>

        <AssetList {...{ selectedAsset: asset, onChangeAmount }} />
        <FormErrorMessage
          errorMessage={validationResult.errorMessage?.asset}
          style={{ marginBottom: 0 }}
        />
        <CopyTokenAddress />
      </StyledFormSection>

      <StyledFormSection>
        <div style={{ position: 'relative' }}>
          <FormLabelInput
            inputProps={{
              type: 'number',
              value: inputAmount,
              onChange: ({ target: { value } }): void => {
                onChangeAmount({ value })
              },
            }}
            labelProps={{ children: 'Amount' }}
          />
          <StyledMaxButton onClick={onClickMaxButton}>Max</StyledMaxButton>
        </div>

        {isLoggedIn && (
          <FormErrorMessage
            errorMessage={validationResult.errorMessage?.amount}
          />
        )}
      </StyledFormSection>

      <StyledFormSection>
        <FormLabelInput
          inputProps={{
            value: toAddress,
            onChange: ({ target: { value } }): void => {
              onChangeToAddress({ value })
            },
          }}
          labelProps={{ children: 'Destination Address' }}
        />
        <FormErrorMessage
          errorMessage={validationResult.errorMessage?.toAddress}
        />
      </StyledFormSection>

      {fromBlockChain === BlockChainType.terra &&
        toBlockChain === BlockChainType.terra && (
          <StyledFormSection>
            <FormLabelInput
              inputProps={{
                value: memo,
                onChange: ({ target: { value } }): void => {
                  onChangeMemo({ value })
                },
              }}
              labelProps={{ children: 'Memo (optional)' }}
            />
            <FormErrorMessage
              errorMessage={validationResult.errorMessage?.memo}
            />
          </StyledFormSection>
        )}

      {/* only if from terra */}
      <FormFeeInfo feeValidationResult={feeValidationResult} />
      <WarningInfo />
    </StyledContainer>
  )
}

export default SendForm
