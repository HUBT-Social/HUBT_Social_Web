import AOS from 'aos';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react'; // Import PersistGate
import App from './App';
import './index.css';
import { persistor, store } from './store/store'; // Import store and persistor

AOS.init({
  duration: 1000, // Thời gian hiệu ứng (ms)
  once: true, // Chỉ chạy hiệu ứng một lần khi cuộn
});
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  //<React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
 // </React.StrictMode>
);
