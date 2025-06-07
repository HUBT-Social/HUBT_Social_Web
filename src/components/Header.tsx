import { BellOutlined, MenuOutlined } from '@ant-design/icons';
import { Badge, Button, Dropdown, List, Modal, Typography } from 'antd';
import React, { useState } from 'react';
import { TokenManager } from '../config/axios';
import { useNavigate } from 'react-router';
const { Title, Text } = Typography;

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const notifications = [
    { id: 1, content: '🧠 AI của bạn đã phân tích xong dữ liệu.' },
    { id: 2, content: '🎮 Game mới đã được mở trong HUBT Social.' },
    { id: 3, content: '📚 Lớp học online “React Cơ bản” sắp bắt đầu.' },
    { id: 4, content: '🛒 Đơn hàng #1243 đã được giao thành công.' },
  ];

  const handleLogout = () => {
    setIsModalVisible(true);
  };

  const confirmLogout = () => {
    setIsModalVisible(false);
    TokenManager.clearToken();
    navigate('/login');
  };

  const handleCancelLogout = () => {
    setIsModalVisible(false);
  };

  const notificationMenu = (
    <div className="bg-white rounded-xl shadow-xl w-80 max-h-96 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <Title level={5} className="!m-0 text-hubt-blue">🔔 Thông báo mới</Title>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item className="hover:bg-gray-100 transition duration-200 cursor-pointer px-4 py-2">
            <Text className="text-gray-700">{item.content}</Text>
          </List.Item>
        )}
      />
    </div>
  );

  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Menu icon for mobile */}
      <button
        onClick={onToggleSidebar}
        className="sm:hidden focus:outline-none mr-4"
      >
        <MenuOutlined style={{ fontSize: '20px', color: '#555', cursor: 'pointer' }} />
      </button>

      <div className="flex items-center space-x-6">
        {/* Notification Bell */}
        <Dropdown overlay={notificationMenu} trigger={['click']} placement="bottomRight" arrow>
          <Badge count={notifications.length} size="small" color="#faad14">
            <BellOutlined
              style={{ fontSize: '20px', color: '#555', cursor: 'pointer' }}
            />
          </Badge>
        </Dropdown>

        {/* Logout Button */}
        <Button
          type="primary"
          onClick={handleLogout}
          className="rounded-xl shadow-sm font-semibold ml-5"
        >
          Đăng xuất
        </Button>
      </div>

      {/* Confirm Logout Modal */}
      <Modal
        title={<span className="text-red-600 font-semibold">Xác nhận đăng xuất</span>}
        visible={isModalVisible}
        onOk={confirmLogout}
        onCancel={handleCancelLogout}
        okText="Đăng xuất"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn đăng xuất khỏi HUBT Social?</p>
      </Modal>
    </header>
  );
};

export default Header;