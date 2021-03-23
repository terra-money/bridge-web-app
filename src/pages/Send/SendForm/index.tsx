import { ReactElement, useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import styled from 'styled-components'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import _ from 'lodash'
import { useDebouncedCallback } from 'use-debounce'
import BigNumber from 'bignumber.js'
import {
  ArrowRight,
  ArrowClockwise,
  InfoCircleFill,
} from 'react-bootstrap-icons'

import { ASSET, COLOR, NETWORK, STYLE } from 'consts'

import { BlockChainType } from 'types/network'
import { ValidateResultType } from 'types/send'
import { AssetNativeDenomEnum } from 'types/asset'

import { Text } from 'components'
import FormInput from 'components/FormInput'
import FormLabel from 'components/FormLabel'
import FormErrorMessage from 'components/FormErrorMessage'

import useSend from 'hooks/useSend'
import useAuth from 'hooks/useAuth'
import useShuttle from 'hooks/useShuttle'
import useSendValidate from 'hooks/useSendValidate'
import useAsset from 'hooks/useAsset'

import AuthStore from 'store/AuthStore'
import SendStore from 'store/SendStore'
import SendProcessStore, { ProcessStatus } from 'store/SendProcessStore'

import AssetList from './AssetList'
import SelectBlockChainBox from './SelectBlockChainBox'
import SendFormButton from './SendFormButton'
import FormFeeInfo from './FormFeeInfo'
import useSelectWallet from 'hooks/useSelectWallet'

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
  margin-bottom: 20px;
  border-radius: 1em;
  padding: 12px;
  border: 1px solid ${COLOR.terraSky};
  color: ${COLOR.terraSky};
  font-size: 12px;
  font-weight: 500;
  @media (max-width: 575px) {
    margin-left: 20px;
    margin-right: 20px;
  }
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

  // Computed data from Send data
  const setTax = useSetRecoilState(SendStore.tax)
  const setGasFeeList = useSetRecoilState(SendStore.gasFeeList)
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

  const { getTerraShuttleFee } = useShuttle()
  const { formatBalance, getAssetList } = useAsset()
  const { getTerraFeeList, getTerraSendTax } = useSend()
  const { validateSendData, validateFee } = useSendValidate()
  const feeValidationResult = validateFee()
  const selectWallet = useSelectWallet()

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
      denom: asset?.tokenAddress as AssetNativeDenomEnum,
      feeDenom,
      amount: assetAmount.toString(10),
    })
    const taxAmount = new BigNumber(terraTax?.amount.toString() || 0)

    onChangeAmount({ value: formatBalance(assetAmount.minus(taxAmount)) })
  }

  // after confirm send
  useEffect(() => {
    if (status === ProcessStatus.Done) {
      onChangeAmount({ value: '' })
      onChangeToAddress({ value: '' })
      onChangeMemo({ value: '' })
      getAssetList()
    }
  }, [status])

  const setTerraShuttleFee = async (): Promise<void> => {
    // get terra shutte Fee Info
    if (
      toBlockChain === BlockChainType.ethereum ||
      toBlockChain === BlockChainType.bsc
    ) {
      const sendAmount = new BigNumber(amount)
      if (sendAmount.isGreaterThan(0)) {
        getTerraShuttleFee({
          denom: asset?.tokenAddress || '',
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

    if (asset?.tokenAddress && ableToGetFeeInfo) {
      if (sendDataResult.isValid) {
        // get terra Send Fee Info
        const terraFeeList = await getTerraFeeList()
        setGasFeeList(terraFeeList)
      }

      const terraTax = await getTerraSendTax({
        denom: asset?.tokenAddress as AssetNativeDenomEnum,
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
  }, [amount, toAddress, toBlockChain, memo, asset?.tokenAddress])

  useEffect(() => {
    getAssetList()
  }, [])

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

  useEffect(() => {
    STYLE.isSupportBrowser && selectWallet.open()
    if (
      (fromBlockChain === BlockChainType.ethereum &&
        toBlockChain === BlockChainType.bsc) ||
      (fromBlockChain === BlockChainType.bsc &&
        toBlockChain === BlockChainType.ethereum)
    ) {
      setToBlockChain(BlockChainType.terra)
    }
  }, [fromBlockChain])

  return (
    <StyledContainer>
      {false === STYLE.isSupportBrowser && (
        <div>
          <Row className={'justify-content-md-center'}>
            <Col md={8}>
              <StyledMoblieInfoBox>
                <InfoCircleFill
                  style={{ marginRight: 8, marginTop: -2 }}
                  size={14}
                />
                Bridge only supports desktop Chrome
              </StyledMoblieInfoBox>
            </Col>
          </Row>
        </div>
      )}

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

              <FormErrorMessage
                errorMessage={validationResult.errorMessage?.asset}
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

            <StyledFormSection>
              <FormLabel title={'Destination'} />
              <FormInput
                value={toAddress}
                onChange={({ target: { value } }): void => {
                  onChangeToAddress({ value })
                }}
              />
              <FormErrorMessage
                errorMessage={validationResult.errorMessage?.toAddress}
              />
            </StyledFormSection>

            {fromBlockChain === BlockChainType.terra &&
              toBlockChain === BlockChainType.terra && (
                <StyledFormSection>
                  <FormLabel title={'Memo (optional)'} />
                  <FormInput
                    value={memo}
                    onChange={({ target: { value } }): void => {
                      onChangeMemo({ value })
                    }}
                  />
                  <FormErrorMessage
                    errorMessage={validationResult.errorMessage?.memo}
                  />
                </StyledFormSection>
              )}

            {/* only if from terra */}
            <FormFeeInfo
              validationResult={validationResult}
              feeValidationResult={feeValidationResult}
            />

            <SendFormButton
              onClickSendButton={onClickSendButton}
              validationResult={validationResult}
              feeValidationResult={feeValidationResult}
            />
          </StyledForm>
        </Col>
      </Row>
    </StyledContainer>
  )
}

export default SendForm
