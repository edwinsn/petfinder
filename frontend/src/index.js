import { render } from 'react-dom';
import { App } from './App.js'

import store from './store'
import { Provider } from 'react-redux'

require('dotenv').config()

render(
    <Provider store={store}>
        <App />
    </Provider>, document.getElementById('app'));