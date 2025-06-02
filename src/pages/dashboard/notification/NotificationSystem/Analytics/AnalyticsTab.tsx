import {
  CheckCircleOutlined,
  EyeOutlined,
  FieldTimeOutlined,
  FireOutlined,
  PieChartOutlined,
  RiseOutlined
} from '@ant-design/icons';
import { Card, Col, Progress, Row, Statistic, Tag, Typography } from 'antd';
import { FC } from 'react';
import { useNotificationContext } from '../../contexts/NotificationContext';
import { notificationTypeOptions } from '../../data/mockData';

const { Title, Text } = Typography;


const AnalyticsTab: FC = () => {
  const { stats } = useNotificationContext();

  // Get a color based on value range (0-100)
  const getColorByValue = (value: number): string => {
    if (value >= 90) return '#52c41a'; // success
    if (value >= 70) return '#1890ff'; // primary
    if (value >= 50) return '#faad14'; // warning
    return '#ff4d4f'; // danger
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Performance Metrics */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-all">
            <Statistic
              title="Total Notifications"
              value={stats.totalSent}
              prefix={<PieChartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div className="mt-2">
              <Tag color="blue">All Time</Tag>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-all">
            <Statistic
              title="Monthly Average"
              value={Math.floor(stats.totalSent / 12)}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div className="mt-2">
              <Tag color="green">+12.5% ↑</Tag>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-all">
            <Statistic
              title="Average Response Time"
              value={2.4}
              suffix="hrs"
              prefix={<FieldTimeOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
            <div className="mt-2">
              <Tag color="orange">-5.1% ↓</Tag>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-all">
            <Statistic
              title="User Engagement"
              value={62.8}
              suffix="%"
              prefix={<FireOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
            <div className="mt-2">
              <Tag color="purple">+8.3% ↑</Tag>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Delivery & Read Stats */}
      <Card 
        title={
          <div className="flex items-center space-x-2">
            <CheckCircleOutlined />
            <span>Delivery & Read Rates</span>
          </div>
        }
        className="hover:shadow-md transition-all"
      >
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={12}>
            <div className="text-center p-4">
              <Progress 
                type="dashboard" 
                percent={stats.deliveryRate} 
                format={(percent: number | undefined) => `${percent?.toFixed(1)}%`}
                strokeColor={getColorByValue(stats.deliveryRate)}
                width={180}
              />
              <Title level={4} className="mt-4 mb-1">Delivery Rate</Title>
              <Text type="secondary">
                {stats.deliveryRate >= 90 ? 'Excellent' : 
                 stats.deliveryRate >= 70 ? 'Good' : 
                 stats.deliveryRate >= 50 ? 'Average' : 'Needs Improvement'}
              </Text>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="text-center p-4">
              <Progress 
                type="dashboard" 
                percent={stats.readRate} 
                format={(percent: number | undefined) => `${percent?.toFixed(1)}%`}
                strokeColor={getColorByValue(stats.readRate)}
                width={180}
              />
              <Title level={4} className="mt-4 mb-1">Read Rate</Title>
              <Text type="secondary">
                {stats.readRate >= 90 ? 'Excellent' : 
                 stats.readRate >= 70 ? 'Good' : 
                 stats.readRate >= 50 ? 'Average' : 'Needs Improvement'}
              </Text>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Notification Types Distribution */}
      <Card 
        title={
          <div className="flex items-center space-x-2">
            <PieChartOutlined />
            <span>Notification Types Distribution</span>
          </div>
        }
        className="hover:shadow-md transition-all"
      >
        <Row gutter={[16, 16]}>
          {notificationTypeOptions.map((type) => {
            const Icon = type.icon;
            return (
              <Col xs={12} sm={8} md={6} key={type.value}>
                <div className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-all">
                  <div className={`mx-auto mb-3 w-12 h-12 rounded-full bg-gradient-to-r ${type.gradient} flex items-center justify-center`}>
                    <Icon style={{ fontSize: '24px', color: '#fff' }} />
                  </div>
                  <div className="font-semibold text-lg">
                    {stats.typeDistribution[type.value] || 0}%
                  </div>
                  <div className="text-sm text-gray-500">{type.label}</div>
                  <Progress 
                    percent={stats.typeDistribution[type.value] || 0} 
                    showInfo={false}
                    strokeColor={type.value === 'default' ? '#8c8c8c' : type.value}
                    className="mt-2"
                  />
                </div>
              </Col>
            );
          })}
        </Row>
      </Card>

      {/* Monthly Trend */}
      <Card 
        title={
          <div className="flex items-center space-x-2">
            <RiseOutlined />
            <span>Monthly Trend</span>
          </div>
        }
        className="hover:shadow-md transition-all"
      >
        <div className="p-4">
          <div className="h-[200px] flex items-end justify-between">
            {stats.monthlyTrend.map((value, index) => {
              const height = (value / Math.max(...stats.monthlyTrend)) * 100;
              return (
                <div key={index} className="flex flex-col items-center w-1/12">
                  <div 
                    className="w-5/6 bg-gradient-to-t from-blue-500 to-indigo-600 rounded-t-md transition-all hover:opacity-80"
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="text-xs text-gray-500 mt-2">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Engagement Metrics */}
      <Card 
        title={
          <div className="flex items-center space-x-2">
            <EyeOutlined />
            <span>Engagement Metrics</span>
          </div>
        }
        className="hover:shadow-md transition-all"
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <div className="text-center p-4 border-r border-gray-200">
              <Title level={3} className="mb-0 text-blue-600">3.2s</Title>
              <Text type="secondary" className="block mb-2">Average Read Time</Text>
              <Progress percent={64} status="active" />
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="text-center p-4 border-r border-gray-200">
              <Title level={3} className="mb-0 text-green-600">24%</Title>
              <Text type="secondary" className="block mb-2">Action Rate</Text>
              <Progress percent={24} status="active" strokeColor="#52c41a" />
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="text-center p-4">
              <Title level={3} className="mb-0 text-purple-600">4.8%</Title>
              <Text type="secondary" className="block mb-2">Unsubscribe Rate</Text>
              <Progress percent={4.8} status="exception" />
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AnalyticsTab;