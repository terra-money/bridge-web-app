import { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Col, Container, Row } from 'react-bootstrap'
import * as Sentry from '@sentry/react'
import { useRecoilValue } from 'recoil'
import _ from 'lodash'

import { COLOR, STYLE, NETWORK } from 'consts'
import { Button, Text } from 'components'
import NetworkStore from 'store/NetworkStore'
import ContractStore from 'store/ContractStore'

const StyledBg = styled.div`
  position: absolute;
  z-index: 10;
  top: 0;
  background-color: #000000cc;
  width: 100%;
  height: 100%;
  padding: 100px;
`

const StyledContainer = styled(Container)`
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

const StyledTitle = styled(Text)`
  display: block;
  font-size: 24;
  font-weight: 500;
  color: ${COLOR.skyGray};
  font-size: 14px;
`

const StyledInfoText = styled(Text)`
  display: block;

  border: 1px solid ${COLOR.skyGray};
  border-radius: ${STYLE.css.borderRadius};
  margin-bottom: 20px;
  font-size: 12px;
  word-break: break-all;
  white-space: pre-wrap;
  padding: 20px;
`

const RefreshButton = ({ isOnline }: { isOnline: boolean }): ReactElement => (
  <>
    {isOnline && (
      <Button
        onClick={(): void => {
          window.location.reload()
        }}
      >
        Refresh
      </Button>
    )}
  </>
)

const NetworkErrorScreen = (): ReactElement => {
  const isTestnet = useRecoilValue(NetworkStore.isTestnet)
  const shuttlePairs = useRecoilValue(ContractStore.initOnlyShuttlePairs)
  const terraWhiteList = useRecoilValue(ContractStore.initOnlyTerraWhiteList)
  const ethWhiteList = useRecoilValue(ContractStore.initOnlyEthWhiteList)
  const bscWhiteList = useRecoilValue(ContractStore.initOnlyBscWhiteList)

  const [isOnline, setIsOnline] = useState(window.navigator.onLine)
  const [showError, setShowError] = useState(false)
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>()

  const onOffline = (): void => {
    setIsOnline(false)
    setShowError(true)
    setTitle('No internet connection')
    setContent('Please check your internet connection and try again.')
  }

  const onOnline = (): void => {
    setIsOnline(true)
    setShowError(false)
  }

  const checkIfServerAvailable = async (): Promise<{
    success: boolean
    errorMessage?: string
  }> => {
    try {
      _.forEach(
        [
          { name: 'Shuttle Pairs Json', value: shuttlePairs },
          { name: 'Terra Whitelist Json', value: terraWhiteList },
          { name: 'Ethereum Whitelist Json', value: ethWhiteList },
          { name: 'BSC Whitelist Json', value: bscWhiteList },
        ],
        (item) => {
          if (_.isEmpty(item.value)) {
            throw new Error(`Error: "${item.name}" data does not exist.`)
          }
        }
      )
    } catch (error) {
      Sentry.captureException(error)
      return {
        success: false,
        errorMessage: _.toString(error),
      }
    }

    const fetchUrl =
      NETWORK.terra_networks[isTestnet ? 'testnet' : 'mainnet'].mantle
    try {
      await fetch(fetchUrl)

      return {
        success: true,
      }
    } catch (error) {
      const errorMessage = `Error: ${fetchUrl} is error\nMessage: ${error}`
      Sentry.captureException(errorMessage)
      return {
        success: false,
        errorMessage,
      }
    }
  }

  useEffect(() => {
    if (isOnline) {
      setShowError(false)
      checkIfServerAvailable().then((res) => {
        if (false === res.success) {
          setShowError(true)
          setTitle('Oops! An error occurred.')
          setContent(res?.errorMessage)
        }
      })
    } else {
      onOffline()
    }
  }, [isOnline, isTestnet])

  useEffect(() => {
    window.addEventListener('offline', onOffline)
    window.addEventListener('online', onOnline)
    return (): void => {
      window.removeEventListener('offline', onOffline)
      window.removeEventListener('online', onOnline)
    }
  }, [])

  return showError ? (
    <StyledBg>
      <Row className={'justify-content-md-center'}>
        <Col md={8}>
          <StyledContainer>
            <StyledTitle>{title}</StyledTitle>
            <br />
            <StyledInfoText>{content}</StyledInfoText>
            <RefreshButton isOnline={isOnline} />
          </StyledContainer>
        </Col>
      </Row>
    </StyledBg>
  ) : (
    <></>
  )
}

export default NetworkErrorScreen
