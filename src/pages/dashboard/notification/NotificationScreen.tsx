import React, { useState } from 'react';
import { Table, Tabs, Select, DatePicker, Button, Drawer, Typography } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

const { TabPane } = Tabs;
const { Option } = Select;
const { Title, Paragraph } = Typography;
const { RangePicker } = DatePicker;

interface Notification {
  key: string;
  title: string;
  content: string;
  date: string;
  status: 'unread' | 'read' | 'important' | 'sent';
}

const NotificationScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('incoming');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[moment.Moment | null, moment.Moment | null] | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Sample data
  const incomingNotifications: Notification[] = [
    { key: '1', title: 'Cập nhật hệ thống', content: 'Hệ thống sẽ bảo trì vào 2h sáng.', date: '2025-05-26', status: 'unread' },
    { key: '2', title: 'Thông báo quan trọng', content: 'Vui lòng kiểm tra email.', date: '2025-05-25', status: 'important' },
    { key: '3', title: 'Lịch họp', content: 'Họp đội lúc 10h sáng.', date: '2025-05-24', status: 'read' },
  ];

  const sentNotifications: Notification[] = [
    { key: '4', title: 'Gửi thông báo họp', content: 'Họp đội lúc 10h sáng.', date: '2025-05-24', status: 'sent' },
    { key: '5', title: 'Cập nhật chính sách', content: 'Chính sách mới đã được gửi.', date: '2025-05-23', status: 'sent' },
  ];

  // Filter notifications based on status and date
  const filterNotifications = (notifications: Notification[]) => {
    return notifications.filter((notification) => {
      const matchesStatus = filterStatus === 'all' || notification.status === filterStatus;
      const matchesDate =
        !dateRange ||
        (moment(notification.date).isSameOrAfter(dateRange[0], 'day') &&
          moment(notification.date).isSameOrBefore(dateRange[1], 'day'));
      return matchesStatus && matchesDate;
    });
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: Notification, b: Notification) => moment(a.date).unix() - moment(b.date).unix(),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            status === 'unread'
              ? 'bg-sky-100 text-sky-700'
              : status === 'important'
              ? 'bg-red-100 text-red-700'
              : status === 'read'
              ? 'bg-gray-100 text-gray-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          {status === 'unread' ? 'Chưa đọc' : status === 'important' ? 'Quan trọng' : status === 'read' ? 'Đã đọc' : 'Đã gửi'}
        </span>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      {/* Help Button */}
      <Button
        type="text"
        icon={<QuestionCircleOutlined className="text-sky-600" />}
        onClick={() => setDrawerVisible(true)}
        className="absolute top-4 right-4"
      />

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Select
          defaultValue="all"
          onChange={(value) => setFilterStatus(value)}
          className="w-full sm:w-40"
        >
          <Option value="all">Tất cả</Option>
          <Option value="unread">Chưa đọc</Option>
          <Option value="important">Quan trọng</Option>
          <Option value="read">Đã đọc</Option>
          {activeTab === 'sent' && <Option value="sent">Đã gửi</Option>}
        </Select>
        <RangePicker
          onChange={(dates) => setDateRange(dates as any)}
          format="YYYY-MM-DD"
          className="w-full sm:w-auto"
        />
      </div>

      {/* Tabs */}
      <Tabs activeKey={activeTab} onChange={setActiveTab} className="mb-4">
        <TabPane tab="Thông báo tới" key="incoming">
          <Table
            dataSource={filterNotifications(incomingNotifications)}
            columns={columns}
            pagination={{ pageSize: 5 }}
            rowClassName="hover:bg-sky-50"
          />
        </TabPane>
        <TabPane tab="Thông báo đã gửi" key="sent">
          <Table
            dataSource={filterNotifications(sentNotifications)}
            columns={columns}
            pagination={{ pageSize: 5 }}
            rowClassName="hover:bg-sky-50"
          />
        </TabPane>
      </Tabs>

      {/* Help Drawer */}
      <Drawer
        title="Hướng dẫn sử dụng"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        width={300}
      >
        <Title level={4}>Cách sử dụng màn hình thông báo</Title>
        <Paragraph>
          1. <strong>Chuyển đổi tab</strong>: Sử dụng các tab "Thông báo tới" và "Thông báo đã gửi" để xem các loại thông báo khác nhau.
        </Paragraph>
        <Paragraph>
          2. <strong>Lọc thông báo</strong>: Chọn trạng thái (Tất cả, Chưa đọc, Quan trọng, Đã đọc, Đã gửi) từ menu thả xuống hoặc chọn khoảng thời gian bằng bộ chọn ngày.
        </Paragraph>
        <Paragraph>
          3. <strong>Sắp xếp</strong>: Nhấp vào tiêu đề cột "Ngày" để sắp xếp thông báo theo thứ tự thời gian.
        </Paragraph>
        <Paragraph>
          4. <strong>Điều hướng</strong>: Sử dụng menu bên trái để chuyển đến các chức năng khác như gửi thông báo mới.
        </Paragraph>
      </Drawer>
    </div>
  );
};

export default NotificationScreen;