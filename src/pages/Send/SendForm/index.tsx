import { ReactElement, useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import styled from 'styled-components'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import _ from 'lodash'
import { useDebouncedCallback } from 'use-debounce'
import BigNumber from 'bignumber.js'
import { ArrowRight, ArrowClockwise } from 'react-bootstrap-icons'

import { ASSET, COLOR, NETWORK, STYLE } from 'consts'

import { BlockChainType } from 'types/network'
import { ValidateItemResultType, ValidateResultType } from 'types/send'
import { AssetNativeDenomEnum } from 'types/asset'

import { Button, Text } from 'components'
import FormInput from 'components/FormInput'
import FormLabel from 'components/FormLabel'
import FormSelect from 'components/FormSelect'
import FormErrorMessage from 'components/FormErrorMessage'

import useSend, { TerraSendFeeInfo } from 'hooks/useSend'
import useSelectWallet from 'hooks/useSelectWallet'
import useAuth from 'hooks/useAuth'
import useShuttle from 'hooks/useShuttle'
import useSendValidate from 'hooks/useSendValidate'
import useAsset from 'hooks/useAsset'

import AuthStore from 'store/AuthStore'
import SendStore from 'store/SendStore'

import AssetList from './AssetList'
import SelectBlockChainBox from './SelectBlockChainBox'
import SendProcessStore, { ProcessStatus } from 'store/SendProcessStore'

const StyledContainer = styled(Container)`
  padding: 40px 0;
  height: 100%;
`

const StyledForm = styled.div`
  background-color: ${COLOR.darkGray};
  padding: 40px 10%;
`

const StyledFormSection = styled.div`
  margin-bottom: 20px;
`

const StyledMaxButton = styled.div`
  position: absolute;
  top: 8px;
  right: 20px;
  border: 2px solid ${COLOR.skyGray};
  border-radius: ${STYLE.css.borderRadius};
  padding: 5px 10px;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`

const StyledRefreshButton = styled.div`
  display: inline-block;
  color: ${COLOR.primary};
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`

const SendFormButton = ({
  validationResult,
  onClickSendButton,
  isValidGasFee,
}: {
  validationResult: ValidateResultType
  onClickSendButton: () => Promise<void>
  isValidGasFee: ValidateItemResultType
}): ReactElement => {
  const selectWallet = useSelectWallet()
  const isLoggedIn = useRecoilValue(AuthStore.isLoggedIn)

  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)

  return isLoggedIn ? (
    <Button
      onClick={onClickSendButton}
      disabled={
        false === validationResult.isValid ||
        (fromBlockChain === BlockChainType.terra &&
          false === isValidGasFee.isValid)
      }
    >
      Next
    </Button>
  ) : (
    <Button onClick={selectWallet.open}>Connect Wallet</Button>
  )
}

const FormFeeInfo = ({
  validationResult,
  isValidGasFee,
}: {
  validationResult: ValidateResultType
  isValidGasFee: ValidateItemResultType
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

  const { formatBalace } = useAsset()

  return (
    <>
      {isLoggedIn &&
        fromBlockChain === BlockChainType.terra &&
        validationResult.isValid && (
          <StyledFormSection>
            <FormLabel title={'TxFee'} />

            <div>
              <Text style={{ paddingRight: 10 }}>GAS Fee :</Text>
              <Text style={{ paddingRight: 10 }}>
                {feeOfGas ? formatBalace(feeOfGas) : '0'}
              </Text>
              <div className={'d-inline-block'}>
                <FormSelect
                  defaultValue={feeDenom}
                  size={'sm'}
                  optionList={_.map(AssetNativeDenomEnum, (denom) => {
                    return {
                      label: ASSET.symbolOfDenom[denom],
                      value: denom,
                    }
                  })}
                  onSelect={(value: AssetNativeDenomEnum): void => {
                    setFeeDenom(value)
                  }}
                />
              </div>
            </div>
            <FormErrorMessage errorMessage={isValidGasFee.errorMessage} />
            <div>
              {tax && (
                <Text>
                  Tax : {formatBalace(tax)} {asset?.symbol}
                </Text>
              )}
            </div>

            {(toBlockChain === BlockChainType.ethereum ||
              toBlockChain === BlockChainType.bsc) && (
              <div>
                <Text>
                  {`Shuttle fee (estimated) : ${formatBalace(shuttleFee)} ${
                    asset?.symbol
                  }`}
                </Text>
                <br />
                <Text
                  style={
                    amountAfterShuttleFee.isLessThanOrEqualTo(0)
                      ? {
                          color: 'red',
                        }
                      : {}
                  }
                >
                  {`Amount after Shuttle fee (estimated) : ${formatBalace(
                    amountAfterShuttleFee
                  )} ${asset?.symbol}`}
                </Text>
              </div>
            )}
          </StyledFormSection>
        )}
    </>
  )
}

const SendForm = ({
  onClickSendButton,
}: {
  onClickSendButton: () => Promise<void>
}): ReactElement => {
  const loginUser = useRecoilValue(AuthStore.loginUser)
  const isLoggedIn = useRecoilValue(AuthStore.isLoggedIn)
  const { logout } = useAuth()

  const status = useRecoilValue(SendProcessStore.sendProcessStatus)

  // Send Data
  const [asset, setAsset] = useRecoilState(SendStore.asset)
  const [toAddress, setToAddress] = useRecoilState(SendStore.toAddress)
  const [amount, setAmount] = useRecoilState(SendStore.amount)
  const [memo, setMemo] = useRecoilState(SendStore.memo)
  const [toBlockChain, setToBlockChain] = useRecoilState(SendStore.toBlockChain)
  const setGasPrices = useSetRecoilState(SendStore.gasPrices)
  const setFee = useSetRecoilState(SendStore.fee)

  // Computed data from Send data
  const setFeeOfGas = useSetRecoilState(SendStore.feeOfGas)
  const setTax = useSetRecoilState(SendStore.tax)
  const feeDenom = useRecoilValue<AssetNativeDenomEnum>(SendStore.feeDenom)
  const setShuttleFee = useSetRecoilState(SendStore.shuttleFee)
  const setAmountAfterShuttleFee = useSetRecoilState(
    SendStore.amountAfterShuttleFee
  )
  const [fromBlockChain, setFromBlockChain] = useRecoilState(
    SendStore.fromBlockChain
  )

  const [validationResult, setValidationResult] = useState<ValidateResultType>({
    isValid: false,
  })
  const [inputAmount, setInputAmount] = useState('')

  const { formatBalace } = useAsset()
  const { getTerraSendFeeInfo, getTerraMsgs } = useSend()
  const { validateSendData, validateGasFee } = useSendValidate()
  const isValidGasFee = validateGasFee()
  const { getTerraShuttleFee } = useShuttle()
  const { getAssetList } = useAsset()

  const onChangeToAddress = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>): void => {
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
      setAmount(new BigNumber(value).times(decimalSize).toString())
    }
  }

  const onChangeMemo = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>): void => {
    setMemo(value)
  }

  const onClickMaxButton = (): void => {
    onChangeAmount({ value: formatBalace(asset?.balance || '0') })
  }

  // after confirm send
  useEffect(() => {
    if (status === ProcessStatus.Done) {
      getAssetList().then((): void => {
        dbcValidateAndGetFeeInfo.callback()
      })
    }
  }, [status])

  useEffect(() => {
    getAssetList()
  }, [loginUser])

  const dbcGetTerraShuttleFee = useDebouncedCallback(() => {
    if (
      asset?.tokenAddress &&
      fromBlockChain === BlockChainType.terra &&
      (toBlockChain === BlockChainType.ethereum ||
        toBlockChain === BlockChainType.bsc)
    ) {
      const sendAmount = new BigNumber(amount)
      if (sendAmount.isGreaterThan(0)) {
        getTerraShuttleFee({
          denom: asset.tokenAddress,
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
  }, 300)

  // get shuttle(terra -> ether/bsc) fee
  useEffect(() => {
    dbcGetTerraShuttleFee.callback()
    return dbcGetTerraShuttleFee.cancel
  }, [asset?.tokenAddress, amount, toBlockChain])

  const dbcValidateAndGetFeeInfo = useDebouncedCallback(() => {
    const vResult = validateSendData()
    setValidationResult(vResult)
    if (isLoggedIn && fromBlockChain === 'terra') {
      if (
        vResult.isValid &&
        asset?.tokenAddress &&
        amount &&
        feeDenom &&
        toAddress
      ) {
        const msgs = getTerraMsgs()
        getTerraSendFeeInfo({
          denom: asset.tokenAddress as AssetNativeDenomEnum,
          amount,
          feeDenom,
          msgs,
        })
          .then((res?: TerraSendFeeInfo) => {
            setTax('')
            setFeeOfGas('')
            if (res) {
              const { tax, feeOfGas, fee, gasPrices } = res
              setTax(tax.amount.toString())
              setFeeOfGas(feeOfGas.amount.toString())
              setFee(fee)
              setGasPrices(gasPrices)
            }
          })
          .catch(() => {
            setTax('')
            setFeeOfGas('')
          })
      }
    }
  }, 300)

  //get terra send fee info
  useEffect(() => {
    dbcValidateAndGetFeeInfo.callback()
    return dbcValidateAndGetFeeInfo.cancel
  }, [asset?.tokenAddress, amount, feeDenom, toAddress, toBlockChain, memo])

  return (
    <StyledContainer>
      <Row className={'justify-content-md-center'}>
        <Col md={8}>
          <StyledForm>
            <StyledFormSection>
              <Row>
                <Col>
                  <FormLabel title={'Asset'} />
                </Col>
                {isLoggedIn && (
                  <Col style={{ textAlign: 'right' }}>
                    <StyledRefreshButton onClick={getAssetList}>
                      <ArrowClockwise style={{ marginRight: 5 }} size={14} />
                      refresh
                    </StyledRefreshButton>
                  </Col>
                )}
              </Row>
              <AssetList
                {...{ selectedAsset: asset, setSelectedAsset: setAsset }}
              />
            </StyledFormSection>
            <StyledFormSection>
              <Row>
                <Col>
                  <FormLabel title={'From'} />
                  <SelectBlockChainBox
                    {...{
                      blockChain: fromBlockChain,
                      setBlockChain: (value): void => {
                        logout()
                        setFromBlockChain(value)
                      },
                      optionList: [
                        {
                          label: NETWORK.blockChainName[BlockChainType.terra],
                          value: BlockChainType.terra,
                          isDisabled: fromBlockChain === BlockChainType.terra,
                        },
                        {
                          label:
                            NETWORK.blockChainName[BlockChainType.ethereum],
                          value: BlockChainType.ethereum,
                          isDisabled:
                            fromBlockChain === BlockChainType.ethereum,
                        },
                        {
                          label: NETWORK.blockChainName[BlockChainType.bsc],
                          value: BlockChainType.bsc,
                          isDisabled: fromBlockChain === BlockChainType.bsc,
                        },
                      ],
                    }}
                  />
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
                <Col>
                  <FormLabel title={'To'} />
                  <SelectBlockChainBox
                    {...{
                      blockChain: toBlockChain,
                      setBlockChain: setToBlockChain,
                      optionList: [
                        {
                          label: NETWORK.blockChainName[BlockChainType.terra],
                          value: BlockChainType.terra,
                        },
                        {
                          label:
                            NETWORK.blockChainName[BlockChainType.ethereum],
                          value: BlockChainType.ethereum,
                          isDisabled: fromBlockChain === BlockChainType.bsc,
                        },
                        {
                          label: NETWORK.blockChainName[BlockChainType.bsc],
                          value: BlockChainType.bsc,
                          isDisabled:
                            fromBlockChain === BlockChainType.ethereum,
                        },
                      ],
                    }}
                  />
                </Col>
              </Row>
            </StyledFormSection>

            <StyledFormSection>
              <FormLabel title={'Amount'} />
              <div style={{ position: 'relative' }}>
                <FormInput
                  type={'number'}
                  value={inputAmount}
                  onChange={({ target: { value } }): void => {
                    onChangeAmount({ value })
                  }}
                  placeholder={'0'}
                />
                <StyledMaxButton onClick={onClickMaxButton}>
                  Max
                </StyledMaxButton>
              </div>

              {isLoggedIn && (
                <FormErrorMessage
                  errorMessage={validationResult.errorMessage?.amount}
                />
              )}
            </StyledFormSection>

            {fromBlockChain === BlockChainType.terra &&
              toBlockChain === BlockChainType.terra && (
                <StyledFormSection>
                  <FormLabel title={'Memo'} />
                  <FormInput value={memo} onChange={onChangeMemo} />
                  <FormErrorMessage
                    errorMessage={validationResult.errorMessage?.memo}
                  />
                </StyledFormSection>
              )}

            <StyledFormSection>
              <FormLabel title={'Destination'} />
              <FormInput value={toAddress} onChange={onChangeToAddress} />
              <FormErrorMessage
                errorMessage={validationResult.errorMessage?.toAddress}
              />
            </StyledFormSection>

            {/* only if from terra */}
            <FormFeeInfo
              validationResult={validationResult}
              isValidGasFee={isValidGasFee}
            />

            <SendFormButton
              onClickSendButton={onClickSendButton}
              validationResult={validationResult}
              isValidGasFee={isValidGasFee}
            />
          </StyledForm>
        </Col>
      </Row>
    </StyledContainer>
  )
}

export default SendForm
