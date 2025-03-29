import React from 'react';
import { Badge, Button } from 'antd';
import { BellOutlined } from '@ant-design/icons';

const Header: React.FC = () => {
  const handleLogout = () => {
    console.log('Logging out...');
    // TODO: Gọi API logout hoặc điều hướng tới login
  };

  const handleNotificationClick = () => {
    console.log('Clicked on notifications');
    // TODO: Mở dropdown hoặc modal thông báo
  };

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-end items-center">
      <div className="flex items-center space-x-6">
        {/* Bell icon with blue dot using Badge */}
        <Badge dot status="processing" color="#1890ff">
          <BellOutlined
            style={{ fontSize: '18px', color: '#444', cursor: 'pointer' }}
            onClick={handleNotificationClick}
          />
        </Badge>

        {/* Log out button */}
        <Button type="text" className="text-sm text-gray-700 hover:text-black" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </header>
  );
};

export default Header;
