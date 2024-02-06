// Entry for index page

// ====== IMPORTS ======

// React
import React from 'react';
import { createRoot } from 'react-dom/client';

// Components
import App from './react/App.js';

// Styling
import './index.css';

// Functions
import addEventListeners from '../functions/addEventListeners.js';'../functions/addEventListeners.js'

// ====== RENDER/MAIN ======

// Add window events
addEventListeners();

// Render React
const root = createRoot(document.querySelector('#reactEntry'));
root.render(<App />);

