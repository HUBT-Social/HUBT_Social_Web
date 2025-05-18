import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary text-white space-y-6 p-8">
      {/* Tiêu đề */}
      <h1 className="text-4xl font-bold text-hubt-yellow drop-shadow-md">
        Cài đặt tài khoản
      </h1>

      {/* Hộp thông báo */}
      <div className="bg-primary-light text-white px-6 py-4 rounded-2xl shadow-md w-full max-w-md text-center">
        Xin chào <span className="text-hubt-yellow font-semibold">HUBT Social</span> 👋
      </div>

      {/* Nút thao tác */}
      <button className="bg-hubt-yellow text-hubt-blue font-semibold px-6 py-3 rounded-xl hover:bg-yellow-400 transition duration-300">
        Đăng nhập
      </button>

      {/* Nút thử màu alert */}
      <div className="space-x-3">
        <button className="bg-success px-4 py-2 rounded-xl">Thành công</button>
        <button className="bg-warning px-4 py-2 rounded-xl">Cảnh báo</button>
        <button className="bg-danger px-4 py-2 rounded-xl">Lỗi</button>
      </div>
    </div>
  );
};

export default SettingsPage;
