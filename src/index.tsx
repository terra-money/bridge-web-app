import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { RecoilRoot } from 'recoil'
import reportWebVitals from './reportWebVitals'
import * as Sentry from '@sentry/react'

const sentryDsn = process.env.REACT_APP_SENTRY_DSN
const sentryEnv = process.env.REACT_APP_SENTRY_ENV

if (sentryDsn && sentryEnv) {
  Sentry.init({
    dsn: sentryDsn,
    environment: sentryEnv,
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  })
}

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
