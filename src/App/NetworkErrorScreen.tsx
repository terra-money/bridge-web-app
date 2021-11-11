import { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useRecoilValue } from 'recoil'
import _ from 'lodash'

import { COLOR } from 'consts'
import { Button, Text, Container } from 'components'
import NetworkStore from 'store/NetworkStore'
import ContractStore from 'store/ContractStore'

import { ExclamationCircle } from 'react-bootstrap-icons'

const StyledBg = styled.div`
  position: absolute;
  z-index: 10;
  top: 0;
  background-color: #000000cc;
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  align-items: center;
`

const StyledContainer = styled(Container)`
  background-color: ${COLOR.darkGray};
  max-width: 640px;
  padding: 40px;
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
  font-weight: 400;
  color: ${COLOR.red};
  font-size: 18px;
  text-align: center;
`

const StyledInfoText = styled(Text)`
  display: block;
  font-size: 14px;
  word-break: break-all;
  white-space: pre-wrap;
  padding: 10px 20px 0;
  text-align: center;
`

const RefreshButton = ({ isOnline }: { isOnline: boolean }): ReactElement => (
  <>
    {isOnline && (
      <Button
        onClick={(): void => {
          window.location.reload()
        }}
        style={{ marginTop: 40 }}
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
  const hmyWhiteList = useRecoilValue(ContractStore.initOnlyHmyWhiteList)

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
          { name: 'Harmony Whitelist Json', value: hmyWhiteList },
        ],
        (item) => {
          if (_.isEmpty(item.value)) {
            throw new Error(`"${item.name}" data does not exist.`)
          }
        }
      )
    } catch (error) {
      return {
        success: false,
        errorMessage: _.toString(error),
      }
    }

    return {
      success: true,
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
      <StyledContainer>
        <div style={{ textAlign: 'center' }}>
          <ExclamationCircle
            style={{ fontSize: 32, marginBottom: 5, color: COLOR.red }}
          />
        </div>
        <StyledTitle>{title}</StyledTitle>
        <StyledInfoText>{content}</StyledInfoText>
        <RefreshButton isOnline={isOnline} />
      </StyledContainer>
    </StyledBg>
  ) : (
    <></>
  )
}

export default NetworkErrorScreen
