import { ReactElement, lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

import SendPage from 'pages/Send'
import DashboardPage from 'pages/Dashboard'

const IbcTestPage = lazy(() => import('pages/IbcTest'))

const AppRoutes = (): ReactElement => {
  return (
    <Routes>
      <Route path="/" element={<SendPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route
        path="/ibc-test"
        element={
          <Suspense fallback={null}>
            <IbcTestPage />
          </Suspense>
        }
      />
    </Routes>
  )
}
export default AppRoutes
