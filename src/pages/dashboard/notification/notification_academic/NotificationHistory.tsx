import React from 'react';
import { Card, Tag, Space, Progress, Typography } from 'antd';
import { notificationTypes, priorities } from '../constants/notificationConstants';
import { NotificationHistory } from '../../../../types/Notification';

const { Text } = Typography;

interface NotificationHistoryProps {
  history: NotificationHistory[];
  darkMode: boolean;
}

const NotificationHistoryComponent: React.FC<NotificationHistoryProps> = ({ history, darkMode }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <Card 
      title="📊 Lịch sử thông báo"
      className={`mt-8 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-lg`}
    >
      <div className="space-y-4">
        {history.slice(0, 5).map(item => (
          <div key={item.id} className={`p-4 rounded-lg border ${
            darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex justify-between items-start">
              <div>
                <Space>
                  <Tag color={notificationTypes.find(t => t.value === item.type)?.color}>
                    {notificationTypes.find(t => t.value === item.type)?.icon} {' '}
                    {notificationTypes.find(t => t.value === item.type)?.label}
                  </Tag>
                  <Tag color={priorities.find(p => p.value === item.priority)?.color}>
                    {priorities.find(p => p.value === item.priority)?.label}
                  </Tag>
                </Space>
                <div className="mt-2">
                  <Text strong>{item.recipients.length} người nhận</Text>
                  <Text type="secondary" className="ml-4">
                    {new Date(item.timestamp).toLocaleString('vi-VN')}
                  </Text>
                </div>
              </div>
              <div className="text-right">
                <div>Tỷ lệ đã đọc</div>
                <Progress 
                  percent={item.readRate} 
                  size="small"
                  format={percent => `${percent}%`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default NotificationHistoryComponent;