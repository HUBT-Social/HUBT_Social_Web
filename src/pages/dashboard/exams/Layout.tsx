import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý đề ôn tập</h1>
        <p className="text-gray-600 text-sm">Trang chủ / Quản lý đề ôn tập</p>
      </header>
      <main className="container mx-auto p-8">{children}</main>
      <footer className="w-full h-40 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 mt-8"></footer>
    </div>
  );
};

export default Layout;