import { ReactElement } from 'react'
import { Switch, Route } from 'react-router-dom'

import SendPage from 'pages/Send'

export enum PathEnum {
  default = '',
  sendComplete = 'sendComplete',
}

const SwitchPages = (): ReactElement => {
  return (
    <Switch>
      <Route exact path={`/${PathEnum.default}`}>
        <SendPage />
      </Route>
    </Switch>
  )
}
export default SwitchPages
