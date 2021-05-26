import { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import { BrowserRouter } from 'react-router-dom'
import routes from 'routes'

import Header from 'components/layouts/Header'
import Footer from 'components/layouts/Footer'
import SelectWalletModal from './SelectWalletModal'
import TerraExtensionDownModal from './TerraExtensionDownModal'
import BscExtensionDownModal from './BscExtensionDownModal'
import NotSupportNetworkModal from './NotSupportNetworkModal'
import NetworkErrorScreen from './NetworkErrorScreen'

import useApp from './useApp'
import useReloadOnNetworkChange from './useReloadOnNetworkChange'

const StyledContainer = styled.div`
  color: white;
  min-height: 100%;
`

const App = (): ReactElement => {
  const [initComplete, setInitComplete] = useState(false)
  useReloadOnNetworkChange()

  const { initApp } = useApp()
  useEffect(() => {
    initApp().then(() => {
      setInitComplete(true)
    })
  }, [])

  return (
    <BrowserRouter>
      {initComplete && (
        <>
          <StyledContainer>
            <Header />
            {routes()}
            <Footer />
          </StyledContainer>
          <SelectWalletModal />
          <TerraExtensionDownModal />
          <BscExtensionDownModal />
          <NotSupportNetworkModal />
          <NetworkErrorScreen />
        </>
      )}
    </BrowserRouter>
  )
}

export default App
