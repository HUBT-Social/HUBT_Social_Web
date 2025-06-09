import { ClockCircleOutlined, FilterOutlined, SearchOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Card, Input, Select, Tag, Timeline, Typography } from 'antd';
import React, { FC, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../../store/store';
import {
  deleteNotification,
  getHistoryNotification,
  selectNotificationHistory,
  selectNotificationLoading,
  selectNotificationError,
} from '../../../../../store/slices/notificationSlice';
import { UINotification } from '../../notification_dashboard/notification-screen.types';
import { notificationTypeOptions } from '../../data/mockData';

const { Title, Text } = Typography;

const HistoryTab: FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const notifications = useSelector(selectNotificationHistory) as UINotification[];
  const loading = useSelector(selectNotificationLoading);
  const error = useSelector(selectNotificationError);


  // Reset expanded items when search or filter changes
  useEffect(() => {
    setExpandedItems([]);
  }, [searchTerm, filterType]);

  // Toggle expand/collapse
  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // Delete notification
  const handleDeleteNotification = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa thông báo này?')) {
      dispatch(deleteNotification({ id }));
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.body.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    return matchesSearch && matchesType;
  });

  if (error) {
    return (
      <Card className="shadow-lg rounded-xl bg-white border border-gray-200">
        <div className="p-4 text-red-600">Lỗi: {error}</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6 px-4 py-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      {/* Search and Filter */}
      <Card className="shadow-lg rounded-xl bg-white border border-gray-200 hover:shadow-xl transition-shadow duration-300">
        <div className="flex flex-col md:flex-row gap-4 p-4">
          <div className="flex-1">
            <Input
              placeholder="Tìm kiếm thông báo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<SearchOutlined className="text-indigo-500" />}
              size="large"
              allowClear
              className="rounded-lg border-gray-300 focus:border-indigo-500"
              disabled={loading}
            />
          </div>
          <div className="w-full md:w-auto">
            <div className="flex items-center gap-2">
              <FilterOutlined className="text-indigo-500" />
              <Select
                value={filterType}
                onChange={setFilterType}
                size="large"
                className="min-w-[180px]"
                options={[
                  { label: 'Tất cả loại', value: 'all' },
                  ...notificationTypeOptions.map((type: { label: any; value: any; }) => ({
                    label: type.label,
                    value: type.value,
                  })),
                ]}
                popupClassName="bg-white shadow-md"
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* History Timeline */}
      <Card
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-indigo-700">
              <ClockCircleOutlined />
              <span className="font-semibold text-lg">Lịch sử thông báo</span>
            </div>
            <Badge
              count={filteredNotifications.length}
              style={{ backgroundColor: '#6366f1' }}
            />
          </div>
        }
        className="shadow-lg rounded-xl bg-white border border-gray-200 hover:shadow-xl transition-shadow duration-300"
      >
        {filteredNotifications.length === 0 ? (
          <div className="py-12 text-center">
            <SearchOutlined style={{ fontSize: 48 }} className="text-gray-300 mb-4" />
            <Text type="secondary" className="block text-lg">
              Không tìm thấy thông báo phù hợp
            </Text>
          </div>
        ) : (
          <Timeline className="mt-6 px-4">
            {filteredNotifications.map((item) => {
              const typeOption =
                notificationTypeOptions.find((t: { value: any; }) => t.value === item.type) ||
                notificationTypeOptions[0];
              const isExpanded = expandedItems.includes(item.id);
              const Icon = typeOption.icon;

              return (
                <Timeline.Item
                  key={item.id}
                  dot={
                    <Avatar
                      size="small"
                      icon={<Icon />}
                      className="bg-gradient-to-r from-indigo-400 to-purple-500 text-white"
                    />
                  }
                >
                  <div
                    className={`bg-gray-50 border border-gray-200 rounded-lg p-5 shadow-sm mb-6 transition-all duration-300 ${
                      isExpanded ? 'shadow-lg bg-white' : 'hover:shadow-md'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <Title
                        level={5}
                        className="mb-0 text-gray-800 font-semibold"
                      >
                        {item.title}
                      </Title>
                      <Badge
                        status={
                          item.status === 'sent'
                            ? 'processing'
                            : item.status === 'delivered'
                            ? 'success'
                            : 'default'
                        }
                        text={item.status.toUpperCase()}
                        className="text-gray-600"
                      />
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <span>
                        <Tag
                          color={
                            typeOption.value === 'default'
                              ? 'default'
                              : typeOption.value
                          }
                          className="rounded-full"
                        >
                          {typeOption.label}
                        </Tag>
                      </span>
                      <span>
                        <UsergroupAddOutlined className="mr-1" />
                        {item.recipients.toLocaleString()} người nhận
                      </span>
                      <span>
                        <ClockCircleOutlined className="mr-1" />
                        {item.time}
                      </span>
                    </div>
                    {isExpanded && (
                      <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100 transition-all duration-300">
                        <Text className="block mb-4 text-gray-700">
                          {item.body}
                        </Text>
                        <Text className="block mb-4 text-gray-600">
                          Tỷ lệ đọc:{' '}
                          {item.recipients > 0
                            ? `${(
                                (item.readCount / item.recipients) *
                                100
                              ).toFixed(1)}%`
                            : 'N/A'}
                        </Text>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="small"
                            type="primary"
                            danger
                            ghost
                            className="border-red-500 text-red-500 hover:bg-red-100"
                            onClick={() => handleDeleteNotification(item.id)}
                            disabled={loading}
                          >
                            Xóa
                          </Button>
                        </div>
                      </div>
                    )}
                    <div className="mt-4">
                      <Button
                        type="link"
                        size="small"
                        onClick={() => toggleExpand(item.id)}
                        className="p-0 text-indigo-600 hover:text-indigo-800"
                        disabled={loading}
                      >
                        {isExpanded ? 'Ẩn chi tiết' : 'Xem chi tiết'}
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