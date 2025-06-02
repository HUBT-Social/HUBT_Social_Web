import {
  CalendarOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  SendOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { Avatar, Badge, Button, Card, Col, List, Row, Space, Statistic, Tag, Typography } from 'antd';
import { FC } from 'react';
import { useNotificationContext } from '../../contexts/NotificationContext';
import { notificationTypeOptions } from '../../data/mockData';
const { Text } = Typography;



interface Notification {
  id: number;
  title: string;
  body: string;
  type: string;
  recipients: number;
  time: string;
  status: string;
}


const DashboardTab: FC = () => {
  const { stats, recentNotifications } = useNotificationContext();

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <Row gutter={[24, 24]} className="animate-fade-in">
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 hover:shadow-lg transition-all">
            <Statistic
              title={<span className="text-blue-100">Total Sent</span>}
              value={stats.totalSent}
              prefix={<SendOutlined className="text-white" />}
              valueStyle={{ color: 'white' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 hover:shadow-lg transition-all">
            <Statistic
              title={<span className="text-green-100">Today's Sent</span>}
              value={stats.todaySent}
              prefix={<TrophyOutlined className="text-white" />}
              valueStyle={{ color: 'white' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 hover:shadow-lg transition-all">
            <Statistic
              title={<span className="text-purple-100">Delivery Rate</span>}
              value={stats.deliveryRate}
              suffix="%"
              prefix={<CheckCircleOutlined className="text-white" />}
              valueStyle={{ color: 'white' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 hover:shadow-lg transition-all">
            <Statistic
              title={<span className="text-orange-100">Read Rate</span>}
              value={stats.readRate}
              suffix="%"
              prefix={<EyeOutlined className="text-white" />}
              valueStyle={{ color: 'white' }}
            />
          </Card>
        </Col>
      </Row>

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
          dataSource={recentNotifications}
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