import { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import { BrowserRouter } from 'react-router-dom'
import routes from 'routes'

import { COLOR } from 'consts'

import Header from 'components/layouts/Header'
import Footer from 'components/layouts/Footer'
import SelectEtherBaseWalletModal from './SelectEtherBaseWalletModal'
import TerraExtensionDownModal from './TerraExtensionDownModal'
import BscExtensionDownModal from './BscExtensionDownModal'
import NotSupportNetworkModal from './NotSupportNetworkModal'
import NetworkErrorScreen from './NetworkErrorScreen'

import useApp from './useApp'
import useReloadOnNetworkChange from './useReloadOnNetworkChange'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${COLOR.appBg};
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
            <div style={{ flex: '1 0 auto' }}>{routes()}</div>
            <Footer />
          </StyledContainer>
          <SelectEtherBaseWalletModal />
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
