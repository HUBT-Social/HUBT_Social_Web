import React, { useEffect } from 'react';
import AppRoutes from './routes/index';
import { useSelector } from 'react-redux';
import { selectSettings } from './store/slices/settingSlice';

const defaultSettings = { darkMode: false, localization: false };

const App: React.FC = () => {
  const settings = useSelector(selectSettings) || defaultSettings;
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.darkMode ? 'dark' : 'light');
  }, [settings]);
  return (
      <AppRoutes />
  );
};

export default App;
