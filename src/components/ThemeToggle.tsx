import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Áp dụng theme khi component mount
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme as 'light' | 'dark');
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme); // Lưu vào localStorage
    message.success(`Chuyển sang theme ${newTheme === 'light' ? 'sáng' : 'tối'} thành công!`);
  };

  return (
    <Button
      className="btn-theme"
      onClick={toggleTheme}
    >
      Chuyển sang {theme === 'light' ? 'Dark' : 'Light'} Theme
    </Button>
  );
};

export default ThemeToggle;