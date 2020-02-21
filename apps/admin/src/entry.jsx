import React from 'react';
import ReactDOM from 'react-dom';
import loadFonts from '@malenovska/common/utilities/fonts';

import App from './App';
import './index.css';

loadFonts();

ReactDOM.render(<App />,document.getElementById('app'));
