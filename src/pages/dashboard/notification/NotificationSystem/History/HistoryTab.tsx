import { ClockCircleOutlined, FilterOutlined, SearchOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Card, Input, Select, Tag, Timeline, Typography } from 'antd';
import React, { FC, useState } from 'react';
import { useNotificationContext } from '../../contexts/NotificationContext';
import { notificationTypeOptions } from '../../data/mockData';

const { Title, Text } = Typography;

// Define types (aligned with mockData.tsx and NotificationProvider.tsx)
interface Notification {
  id: number;
  title: string;
  body: string;
  type: string;
  recipients: number;
  time: string;
  status: string;
}


const HistoryTab: FC = () => {
  const { recentNotifications, searchTerm, setSearchTerm, filterType, setFilterType } = useNotificationContext();
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  // Toggle expanded item
  const toggleExpand = (id: number) => {
    if (expandedItems.includes(id)) {
      setExpandedItems(expandedItems.filter(itemId => itemId !== id));
    } else {
      setExpandedItems([...expandedItems, id]);
    }
  };

  // Filter notifications based on search and filter type
  const filteredNotifications = recentNotifications.filter((notification: Notification) => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      notification.body.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || notification.type === filterType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card className="shadow-sm hover:shadow-md transition-all">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              prefix={<SearchOutlined />}
              size="large"
              allowClear
            />
          </div>
          <div className="w-full md:w-auto">
            <div className="flex items-center gap-2">
              <FilterOutlined className="text-gray-500" />
              <Select
                value={filterType}
                onChange={setFilterType}
                size="large"
                className="min-w-[180px]"
                options={[
                  { label: 'All Types', value: 'all' },
                  ...notificationTypeOptions.map(type => ({ label: type.label, value: type.value }))
                ]}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* History Timeline */}
      <Card 
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ClockCircleOutlined />
              <span>Notification History</span>
            </div>
            <Badge count={filteredNotifications.length} style={{ backgroundColor: '#108ee9' }} />
          </div>
        }
        className="shadow-sm hover:shadow-md transition-all"
      >
        {filteredNotifications.length === 0 ? (
          <div className="py-8 text-center">
            <SearchOutlined style={{ fontSize: 36 }} className="text-gray-300 mb-3" />
            <Text type="secondary" className="block">No notifications match your search criteria</Text>
          </div>
        ) : (
          <Timeline className="mt-4">
            {filteredNotifications.map((item) => {
              const typeOption = notificationTypeOptions.find(t => t.value === item.type) || notificationTypeOptions[0];
              const isExpanded = expandedItems.includes(item.id);
              const Icon = typeOption.icon;
              
              return (
                <Timeline.Item
                  key={item.id}
                  dot={
                    <Avatar 
                      size="small" 
                      icon={<Icon />}
                      className={`bg-gradient-to-r ${typeOption.gradient}`}
                    />
                  }
                >
                  <div 
                    className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-4 transition-all ${
                      isExpanded ? 'shadow-md' : 'hover:shadow-md'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Title level={5} className="mb-1">{item.title}</Title>
                      <Badge 
                        status={item.status === 'sent' ? 'processing' : item.status === 'delivered' ? 'success' : 'default'} 
                        text={item.status.toUpperCase()} 
                      />
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <span>
                        <Tag color={typeOption.value === 'default' ? 'default' : typeOption.value}>
                          {typeOption.label}
                        </Tag>
                      </span>
                      <span><UsergroupAddOutlined className="mr-1" />{item.recipients} recipients</span>
                      <span><ClockCircleOutlined className="mr-1" />{item.time}</span>
                    </div>
                    
                    {isExpanded && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100 animate-fade-in">
                        <Text className="block mb-3">{item.body}</Text>
                        <div className="flex flex-wrap gap-2">
                          <Button size="small" type="primary" ghost>Send Again</Button>
                          <Button size="small">Export Data</Button>
                          <Button size="small" type="primary" danger ghost>Delete</Button>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-3">
                      <Button 
                        type="link" 
                        size="small" 
                        onClick={() => toggleExpand(item.id)}
                        className="p-0"
                      >
                        {isExpanded ? 'Hide Details' : 'View Details'}
                      </Button>
                    </div>
                  </div>
                </Timeline.Item>
              );
            })}
          </Timeline>
        )}
      </Card>
    </div>
  );
};

export default HistoryTab;