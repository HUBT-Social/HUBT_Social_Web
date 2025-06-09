import {
  CalendarOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  SendOutlined
} from '@ant-design/icons';
import { Avatar, Badge, Button, Card, Col, List, Row, Space, Tag, Typography } from 'antd';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { selectNotificationHistory } from '../../../../../store/slices/notificationSlice';
import { Notification } from '../../../../../types/Notification';
import { notificationTypeOptions } from '../../data/mockData';
const { Text } = Typography;




const DashboardTab: FC = () => {
  const notificationHistorySelector = useSelector(selectNotificationHistory);
  return (
    <div className="space-y-6">
      

      {/* Recent Notifications */}
      <Card 
        title={
          <div className="flex items-center space-x-2">
            <CalendarOutlined />
            <span>Recent Notifications</span>
          </div>
        }
        extra={<Button type="link">View All</Button>}
        className="shadow-sm hover:shadow-md transition-all"
      >
        <List
          dataSource={notificationHistorySelector}
          renderItem={(item: Notification) => {
            const typeOption = notificationTypeOptions.find((t: { value: string; }) => t.value === item.type) || notificationTypeOptions[0];
            const Icon = typeOption.icon;
            
            return (
              <List.Item className="hover:bg-gray-50 transition-all rounded-lg px-2">
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      icon={<Icon />}
                      className={`bg-gradient-to-r ${typeOption.gradient}`}
                    />
                  }
                  title={<span className="font-semibold">{item.title}</span>}
                  description={
                    <Space>
                      <Tag color={typeOption.value === 'default' ? 'default' : typeOption.value}>
                        {typeOption.label}
                      </Tag>
                      <Text type="secondary">{item.recipients} recipients</Text>
                      <Text type="secondary">•</Text>
                      <Text type="secondary">{item.time}</Text>
                    </Space>
                  }
                />
                <Badge 
                  status={
                    item.status === 'sent' 
                      ? 'processing' 
                      : item.status === 'delivered' 
                        ? 'success' 
                        : 'default'
                  } 
                  text={item.status.charAt(0).toUpperCase() + item.status.slice(1)} 
                />
              </List.Item>
            );
          }}
        />
      </Card>
      
      {/* Quick Actions */}
      <Card 
        title="Quick Actions" 
        className="shadow-sm hover:shadow-md transition-all"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Button 
              type="primary" 
              icon={<SendOutlined />} 
              onClick={() => {}}
              className="w-full h-auto py-6 flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 border-none hover:from-blue-600 hover:to-indigo-700"
            >
              <span className="text-lg">New Notification</span>
            </Button>
          </Col>
          <Col xs={24} sm={8}>
            <Button 
              icon={<EyeOutlined />} 
              onClick={() => {}}
              className="w-full h-auto py-6 flex items-center justify-center border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <span className="text-lg">View Reports</span>
            </Button>
          </Col>
          <Col xs={24} sm={8}>
            <Button 
              icon={<CheckCircleOutlined />} 
              onClick={() => {}}
              className="w-full h-auto py-6 flex items-center justify-center border-green-200 text-green-600 hover:bg-green-50"
            >
              <span className="text-lg">Manage Templates</span>
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default DashboardTab;