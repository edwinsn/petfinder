import { render } from 'react-dom';
import {App} from './App.js'
require('dotenv').config()


render(<App />, document.getElementById('app'));