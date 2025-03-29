import React from 'react';

const colorsToCheck = {
  primary: 'bg-primary text-white',
  skyblue500: 'bg-skyblue-500 text-white',
  navy300: 'bg-navy-300 text-white',
  tBase: 'bg-gray-200 text-tBase', // Thêm test cho tBase với màu nền dễ thấy
};

const ColorTestPage: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold mb-4">Kiểm tra Màu Sắc</h1>
      {Object.entries(colorsToCheck).map(([colorName, classNames]) => (
        <div key={colorName} className={`w-40 h-20 rounded border border-gray-300 flex items-center justify-center ${classNames}`}>
          {colorName}
        </div>
      ))}
    </div>
  );
};

export default ColorTestPage;