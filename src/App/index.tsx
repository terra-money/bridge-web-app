import { ReactElement } from 'react'
import styled from 'styled-components'
import { BrowserRouter } from 'react-router-dom'

import Header from 'components/layouts/Header'
import Footer from 'components/layouts/Footer'
import routes from 'routes'
import SelectWalletModal from 'components/Modal/SelectWalletModal'
import { COLOR } from 'consts'
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
        <Footer />
      </StyledContainer>
      <SelectWalletModal />
    </BrowserRouter>
  )
}

export default App
