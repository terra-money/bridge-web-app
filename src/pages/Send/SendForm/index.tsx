import { ReactElement, useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import styled from 'styled-components'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import _ from 'lodash'
import { useDebouncedCallback } from 'use-debounce'
import BigNumber from 'bignumber.js'
import { ArrowRight, ArrowClockwise } from 'react-bootstrap-icons'
import { isMobile, MobileView } from 'react-device-detect'

import { ASSET, COLOR, NETWORK } from 'consts'

import { BlockChainType } from 'types/network'
import { ValidateItemResultType, ValidateResultType } from 'types/send'
import { AssetNativeDenomEnum, AssetSymbolEnum } from 'types/asset'

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
  @media (max-width: 575px) {
    padding: 20px 0;
    width: 100vw;
    overflow-x: hidden;
  }
`

const StyledMoblieInfoBox = styled.div`
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
  background-color: ${COLOR.darkGray};
  border-radius: 1em;
  padding: 20px;
  border: 1px solid ${COLOR.blueGray};
`

const StyledForm = styled.div`
  background-color: ${COLOR.darkGray};
  padding: 40px 80px;
  border-radius: 1em;
  @media (max-width: 1199px) {
    padding: 40px;
  }
  @media (max-width: 575px) {
    border-radius: 0;
    padding: 20px;
  }
`

const StyledFormSection = styled.div`
  margin-bottom: 20px;
`

const StyledMaxButton = styled.div`
  position: absolute;
  top: 50%;
  margin-top: -13px;
  right: 20px;
  border: 1px solid ${COLOR.skyGray};
  font-size: 12px;
  border-radius: 5px;
  padding: 0 10px;
  line-height: 24px;
  height: 26px;

  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`

const StyledRefreshButton = styled.div<{ refreshing: boolean }>`
  display: inline-block;
  color: ${COLOR.primary};
  font-size: 12px;
  font-weight: bold;
  opacity: ${({ refreshing }): number => (refreshing ? 0.5 : 1)};
  cursor: ${({ refreshing }): string => (refreshing ? 'default' : 'pointer')};
  user-select: none;
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
    <Button disabled={isMobile} onClick={selectWallet.open}>
      Connect Wallet
    </Button>
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
                paddingTop: 10,
                fontSize: 13,
              }}
            >
              <Text style={{ paddingRight: 5, opacity: '0.8' }}>GAS Fee:</Text>
              <Text style={{ paddingRight: 10, opacity: '0.8' }}>
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
            </div>
            <FormErrorMessage errorMessage={isValidGasFee.errorMessage} />
            <div
              style={{
                fontSize: 13,
                borderBottom: 'dashed 1px #444',
                paddingTop: 5,
                paddingBottom: 10,
              }}
            >
              {tax && (
                <Text style={{ opacity: '0.8' }}>
                  Tax: {formatBalance(tax)} {asset?.symbol}
                </Text>
              )}
            </div>

            {(toBlockChain === BlockChainType.ethereum ||
              toBlockChain === BlockChainType.bsc) && (
              <div
                style={{
                  fontSize: 13,
                  borderBottom: 'dashed 1px #444',
                  paddingTop: 5,
                  paddingBottom: 10,
                }}
              >
                <Text style={{ opacity: '0.8' }}>
                  {`Shuttle fee (estimated) : ${formatBalance(shuttleFee)} ${
                    asset?.symbol
                  }`}
                </Text>
                <br />
                <Text
                  style={{
                    opacity: '0.8',
                    color: amountAfterShuttleFee.isLessThanOrEqualTo(0)
                      ? 'red'
                      : COLOR.text,
                  }}
                >
                  {`Amount after Shuttle fee (estimated) : ${formatBalance(
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
        <Col style={{ textAlign: 'right' }}>
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
        </Col>
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
  const asset = useRecoilValue(SendStore.asset)
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

  const { formatBalance } = useAsset()
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
    onChangeAmount({ value: formatBalance(asset?.balance || '0') })
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
  }, [amount, toBlockChain])

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
  }, [amount, feeDenom, toAddress, toBlockChain, memo])

  return (
    <StyledContainer>
      <MobileView>
        <Row className={'justify-content-md-center'}>
          <Col md={8}>
            <StyledMoblieInfoBox>
              Bridge only supports desktop Chrome
            </StyledMoblieInfoBox>
          </Col>
        </Row>
      </MobileView>

      <Row className={'justify-content-md-center'}>
        <Col md={8}>
          <StyledForm>
            <StyledFormSection>
              <Row>
                <Col>
                  <FormLabel title={'Asset'} />
                </Col>
                <RefreshButton />
              </Row>
              <AssetList {...{ selectedAsset: asset, onChangeAmount }} />
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
                    paddingTop: 18,
                  }}
                >
                  <ArrowRight color={COLOR.white} size={20} />
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
