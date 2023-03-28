import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import store from './redux/store';
import { UIProvider } from './app/context/ui';
import { ThemeProvider } from '@mui/styles'
import { theme } from './assets/theme'

import './index.css';
import App from './App';

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <UIProvider>
        <App />
      </UIProvider>
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
);
