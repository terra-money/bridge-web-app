import { ReactElement, useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import styled from 'styled-components'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import _ from 'lodash'
import { useDebouncedCallback } from 'use-debounce'
import BigNumber from 'bignumber.js'
import { ArrowRight } from 'react-bootstrap-icons'

import { ASSET, COLOR } from 'consts'
import { BlockChainType } from 'types/network'
import { AssetNativeDenomEnum } from 'types/asset'

import AuthStore from 'store/AuthStore'

import { Button, Text } from 'components'
import FormInput from 'components/FormInput'
import FormLabel from 'components/FormLabel'
import FormErrorMessage from 'components/FormErrorMessage'

import useSend, { TerraSendFeeInfo } from 'hooks/useSend'
import useSelectWallet from 'hooks/useSelectWallet'

import FormSelect from 'components/FormSelect'
import useAsset from 'hooks/useAsset'
import useShuttle from 'hooks/useShuttle'
import SendStore from 'store/SendStore'

import AssetList from './AssetList'
import SelectBlockChainBox from './SelectBlockChainBox'
import useSendValidate from 'hooks/useSendValidate'
import { ValidateResultType } from 'types/send'

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
  border-radius: 15px;
  padding: 5px 10px;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`

const SendForm = ({
  onClickSendButton,
}: {
  onClickSendButton: () => Promise<void>
}): ReactElement => {
  const selectWallet = useSelectWallet()
  const loginUser = useRecoilValue(AuthStore.loginUser)
  const isLoggedIn = useRecoilValue(AuthStore.isLoggedIn)

  // Send Data
  const [asset, setAsset] = useRecoilState(SendStore.asset)
  const [toAddress, setToAddress] = useRecoilState(SendStore.toAddress)
  const [amount, setAmount] = useRecoilState(SendStore.amount)
  const [memo, setMemo] = useRecoilState(SendStore.memo)
  const [toBlockChain, setToBlockChain] = useRecoilState(SendStore.toBlockChain)
  const setGasPrices = useSetRecoilState(SendStore.gasPrices)
  const setFee = useSetRecoilState(SendStore.fee)

  // Computed data from Send data
  const [feeOfGas, setFeeOfGas] = useRecoilState(SendStore.feeOfGas)
  const [tax, setTax] = useRecoilState(SendStore.tax)
  const [feeDenom, setFeeDenom] = useRecoilState<AssetNativeDenomEnum>(
    SendStore.feeDenom
  )
  const [shuttleFee, setShuttleFee] = useRecoilState(SendStore.shuttleFee)
  const [amountAfterShuttleFee, setAmountAfterShuttleFee] = useRecoilState(
    SendStore.amountAfterShuttleFee
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
        loginUser.blockChain === 'terra'
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

  useEffect(() => {
    getAssetList().then((): void => {
      onChangeAmount({ value: inputAmount })
    })
  }, [loginUser])

  const dbcGetTerraShuttleFee = useDebouncedCallback(() => {
    if (
      asset?.tokenAddress &&
      loginUser.blockChain === BlockChainType.terra &&
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
          const amountAfterShuttleFee = sendAmount.minus(shuttleFee)
          setAmountAfterShuttleFee(
            amountAfterShuttleFee.isGreaterThan(0)
              ? amountAfterShuttleFee
              : new BigNumber(0)
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
    const validationResult = validateSendData()
    setValidationResult(validationResult)
    if (isLoggedIn && loginUser.blockChain === 'terra') {
      if (
        validationResult.isValid &&
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
              <FormLabel title={'Asset'} />
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
                      blockChain: loginUser.blockChain,
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

            {loginUser.blockChain === BlockChainType.terra &&
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

            {isLoggedIn &&
              loginUser.blockChain === BlockChainType.terra &&
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
                        {`Shuttle fee (estimated) : ${formatBalace(
                          shuttleFee
                        )} ${asset?.symbol}`}
                      </Text>
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
            {isLoggedIn ? (
              <Button
                onClick={onClickSendButton}
                disabled={
                  false === validationResult.isValid ||
                  (loginUser.blockChain === BlockChainType.terra &&
                    false === isValidGasFee.isValid)
                }
              >
                Next
              </Button>
            ) : (
              <Button onClick={selectWallet.openModal}>Connect Wallet</Button>
            )}
          </StyledForm>
        </Col>
      </Row>
    </StyledContainer>
  )
}

export default SendForm
