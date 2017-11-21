
import registerServiceWorker from './registerServiceWorker';

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
//import { createStore } from 'redux'
import configureStore from './configureStore'
import CensusApp from './containers/CensusApp'

let store = configureStore()

render(
  <Provider store={store}>
    <CensusApp />
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker();
