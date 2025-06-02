import { BellOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Typography } from 'antd';

const { Title, Text } = Typography;

const NotificationHeader = () => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
              <BellOutlined className="text-white text-xl" />
            </div>
            <div>
              <Title level={2} className="mb-0 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Notification Management System
              </Title>
              <Text type="secondary">Advanced notification center for educational institutions</Text>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge count={5} className="cursor-pointer">
              <Avatar icon={<BellOutlined />} className="bg-blue-100 text-blue-600" />
            </Badge>
            <Avatar icon={<UserOutlined />} className="bg-gradient-to-r from-purple-500 to-pink-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationHeader;