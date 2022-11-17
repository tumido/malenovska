import React from 'react';
import { createRoot } from 'react-dom/client';
import loadFonts from '@malenovska/common/utilities/fonts';

import App from './App';
import './index.css';

loadFonts();

const root = createRoot(document.getElementById('app'));
root.render(<App />);
