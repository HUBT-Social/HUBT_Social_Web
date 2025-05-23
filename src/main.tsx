import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { store, persistor } from './store/store'; // Import store and persistor
import { PersistGate } from 'redux-persist/integration/react'; // Import PersistGate
import AOS from 'aos';

AOS.init({
  duration: 1000, // Thời gian hiệu ứng (ms)
  once: true, // Chỉ chạy hiệu ứng một lần khi cuộn
});
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
