import { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import { BrowserRouter } from 'react-router-dom'
import routes from 'routes'
import { QueryClient, QueryClientProvider } from 'react-query'

import Header from 'components/layouts/Header'
import Footer from 'components/layouts/Footer'
import SelectWalletModal from './SelectWalletModal'
import TerraExtensionDownModal from './TerraExtensionDownModal'
import BscExtensionDownModal from './BscExtensionDownModal'
import NotSupportNetworkModal from './NotSupportNetworkModal'
import NetworkErrorScreen from './NetworkErrorScreen'
import UnderMaintenance from './UnderMaintenance'

import useApp from './useApp'
import useReloadOnNetworkChange from './useReloadOnNetworkChange'

const queryClient = new QueryClient()

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
    <QueryClientProvider client={queryClient}>
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
            <UnderMaintenance />
          </>
        )}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
