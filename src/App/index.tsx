import { ReactElement } from 'react'
import styled from 'styled-components'
import { BrowserRouter } from 'react-router-dom'
import routes from 'routes'

import { COLOR } from 'consts'

import Header from 'components/layouts/Header'
// import Footer from 'components/layouts/Footer'
import SelectEtherBaseWalletModal from './SelectEtherBaseWalletModal'
import TerraExtensionDownModal from './TerraExtensionDownModal'
import NotSupportNetworkModal from './NotSupportNetworkModal'

import useReloadOnNetworkChange from './useReloadOnNetworkChange'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${COLOR.appBg};
  color: white;
  min-height: 100%;
`

const App = (): ReactElement => {
  useReloadOnNetworkChange()
  return (
    <BrowserRouter>
      <StyledContainer>
        <Header />
        <div style={{ flex: '1 0 auto' }}>{routes()}</div>
        {/* <Footer /> */}
      </StyledContainer>
      <SelectEtherBaseWalletModal />
      <TerraExtensionDownModal />
      <NotSupportNetworkModal />
    </BrowserRouter>
  )
}

export default App
