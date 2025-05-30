import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  Button, 
  Drawer, 
  Select, 
  Table, 
  Tag, 
  Typography, 
  message, 
  DatePicker, 
  Input, 
  Switch,
  Card,
  Statistic,
  Progress,
  Badge,
  Space,
  Divider,
  Alert
} from 'antd';
import { 
  SendOutlined, 
  SearchOutlined, 
  SaveOutlined, 
  ClockCircleOutlined,
  UserOutlined,
  BellOutlined,
  HistoryOutlined,
  TeamOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface NotificationFormValues {
  notificationType: string;
  priority: 'low' | 'medium' | 'high';
  schedule?: any;
  channel: string[];
  customMessage?: string;
}

interface Recipient {
  key: string;
  name: string;
  faculty: string;
  class: string;
  gpa: number;
  absences: number;
  status: string;
  email: string;
  phone: string;
}

interface NotificationHistory {
  id: string;
  type: string;
  priority: string;
  recipients: string[];
  timestamp: string;
  readRate: number;
  deliveryStatus: 'sent' | 'delivered' | 'failed';
  channels: string[];
}

interface SavedGroup {
  name: string;
  keys: React.Key[];
  description?: string;
  createdAt: string;
}

const EnhancedNotificationSystem: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [savedGroups, setSavedGroups] = useState<SavedGroup[]>([]);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [history, setHistory] = useState<NotificationHistory[]>([]);
  const [searchText, setSearchText] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Form values
  const [notificationType, setNotificationType] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [channels, setChannels] = useState<string[]>([]);
  const [customMessage, setCustomMessage] = useState('');
  const [scheduleDate, setScheduleDate] = useState<any>(null);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const notificationTypes = [
    { 
      value: 'warning', 
      label: 'Cảnh báo học tập', 
      defaultContent: 'Sinh viên cần cải thiện điểm số để đạt yêu cầu tốt nghiệp.',
      icon: '⚠️',
      color: 'orange'
    },
    { 
      value: 'event', 
      label: 'Sự kiện', 
      defaultContent: 'Thông báo về sự kiện quan trọng sắp diễn ra tại trường.',
      icon: '📅',
      color: 'blue'
    },
    { 
      value: 'tuition', 
      label: 'Học phí', 
      defaultContent: 'Nhắc nhở về thời hạn nộp học phí học kỳ.',
      icon: '💰',
      color: 'green'
    },
    { 
      value: 'attendance', 
      label: 'Điểm danh', 
      defaultContent: 'Cảnh báo về tình trạng nghỉ học vượt quá quy định.',
      icon: '📋',
      color: 'red'
    },
    { 
      value: 'emergency', 
      label: 'Khẩn cấp', 
      defaultContent: 'Thông báo khẩn cấp từ ban giám hiệu trường.',
      icon: '🚨',
      color: 'volcano'
    },
  ];

  const priorities = [
    { value: 'low', label: 'Thấp', color: 'green', percentage: 25 },
    { value: 'medium', label: 'Trung bình', color: 'orange', percentage: 60 },
    { value: 'high', label: 'Cao', color: 'red', percentage: 90 },
  ];

  const channelOptions = [
    { value: 'Push', label: 'Push Notification', icon: '🔔' },
    { value: 'Email', label: 'Email', icon: '📧' },
    { value: 'SMS', label: 'SMS', icon: '💬' }
  ];

  const recipients: Recipient[] = [
    { 
      key: '1', 
      name: 'Nguyễn Văn An', 
      faculty: 'CNTT', 
      class: 'Lớp A1', 
      gpa: 7.5, 
      absences: 2, 
      status: 'Đang học',
      email: 'an.nv@student.edu.vn',
      phone: '0901234567'
    },
    { 
      key: '2', 
      name: 'Trần Thị Bình', 
      faculty: 'Điện', 
      class: 'Lớp B1', 
      gpa: 3.8, 
      absences: 5, 
      status: 'Cảnh báo',
      email: 'binh.tt@student.edu.vn',
      phone: '0902345678'
    },
    { 
      key: '3', 
      name: 'Lê Văn Cường', 
      faculty: 'Cơ khí', 
      class: 'Lớp A2', 
      gpa: 6.0, 
      absences: 1, 
      status: 'Đang học',
      email: 'cuong.lv@student.edu.vn',
      phone: '0903456789'
    },
    { 
      key: '4', 
      name: 'Phạm Thị Dung', 
      faculty: 'CNTT', 
      class: 'Lớp A3', 
      gpa: 8.2, 
      absences: 0, 
      status: 'Đang học',
      email: 'dung.pt@student.edu.vn',
      phone: '0904567890'
    },
    { 
      key: '5', 
      name: 'Hoàng Văn Em', 
      faculty: 'Điện', 
      class: 'Lớp B2', 
      gpa: 5.5, 
      absences: 3, 
      status: 'Cảnh báo',
      email: 'em.hv@student.edu.vn',
      phone: '0905678901'
    },
  ];

  // Enhanced filtering
  const filteredRecipients = useMemo(() => {
    if (!searchText) return recipients;
    return recipients.filter(recipient =>
      recipient.name.toLowerCase().includes(searchText.toLowerCase()) ||
      recipient.faculty.toLowerCase().includes(searchText.toLowerCase()) ||
      recipient.class.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText]);

  // Smart suggestion based on context
  const suggestedType = useMemo(() => {
    const month = currentTime.getMonth();
    const date = currentTime.getDate();
    const selectedGPAs = selectedRowKeys.map(key => 
      recipients.find(r => r.key === key)?.gpa || 0
    );
    const avgGPA = selectedGPAs.length > 0 ? 
      selectedGPAs.reduce((a, b) => a + b, 0) / selectedGPAs.length : 0;

    if (avgGPA < 5.0) return 'warning';
    if (month === 8 || month === 1) return 'tuition';
    if (date > 20) return 'attendance';
    return 'event';
  }, [currentTime, selectedRowKeys]);

  // Enhanced table columns
  const columns = [
    {
      title: 'Tên sinh viên',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Recipient) => (
        <Space>
          <UserOutlined />
          <div>
            <div style={{ fontWeight: 'bold' }}>{text}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>{record.email}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Khoa',
      dataIndex: 'faculty',
      key: 'faculty',
      filters: [...new Set(recipients.map(r => r.faculty))].map(f => ({ text: f, value: f })),
      onFilter: (value: any, record: Recipient) => record.faculty === value,
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Lớp',
      dataIndex: 'class',
      key: 'class',
      render: (text: string) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: 'Điểm TB',
      dataIndex: 'gpa',
      key: 'gpa',
      sorter: (a: Recipient, b: Recipient) => a.gpa - b.gpa,
      render: (gpa: number) => (
        <div>
          <Text strong style={{ color: gpa >= 7 ? '#52c41a' : gpa >= 5 ? '#faad14' : '#ff4d4f' }}>
            {gpa.toFixed(1)}
          </Text>
          <Progress 
            percent={gpa * 10} 
            size="small" 
            showInfo={false}
            strokeColor={gpa >= 7 ? '#52c41a' : gpa >= 5 ? '#faad14' : '#ff4d4f'}
          />
        </div>
      ),
    },
    {
      title: 'Vắng mặt',
      dataIndex: 'absences',
      key: 'absences',
      sorter: (a: Recipient, b: Recipient) => a.absences - b.absences,
      render: (absences: number) => (
        <Badge 
          count={absences} 
          style={{ backgroundColor: absences > 3 ? '#ff4d4f' : '#52c41a' }}
        />
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [...new Set(recipients.map(r => r.status))].map(s => ({ text: s, value: s })),
      onFilter: (value: any, record: Recipient) => record.status === value,
      render: (status: string) => (
        <Tag color={status === 'Đang học' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
  ];

  // Statistics
  const stats = useMemo(() => {
    const total = recipients.length;
    const selected = selectedRowKeys.length;
    const warningStudents = recipients.filter(r => r.status === 'Cảnh báo').length;
    const avgGPA = recipients.reduce((sum, r) => sum + r.gpa, 0) / recipients.length;
    
    return { total, selected, warningStudents, avgGPA };
  }, [selectedRowKeys]);

  // Handle form submission with enhanced validation
  const onFinish = useCallback(async () => {
    if (selectedRowKeys.length === 0) {
      message.error('Vui lòng chọn ít nhất một người nhận!');
      return;
    }

    if (!notificationType) {
      message.error('Vui lòng chọn loại thông báo!');
      return;
    }

    if (channels.length === 0) {
      message.error('Vui lòng chọn ít nhất một kênh gửi!');
      return;
    }

    setIsLoading(true);
    try {
      const notification: NotificationHistory = {
        id: Math.random().toString(36).substr(2, 9),
        type: notificationType,
        priority: priority,
        recipients: selectedRowKeys.map(String),
        timestamp: scheduleDate ? scheduleDate.format() : new Date().toISOString(),
        readRate: Math.floor(Math.random() * 100),
        deliveryStatus: 'sent',
        channels: channels,
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setHistory(prev => [notification, ...prev]);
      message.success({
        content: `Thông báo đã được gửi thành công đến ${selectedRowKeys.length} người nhận!`,
        duration: 3,
      });
      
      // Reset form
      setNotificationType('');
      setPriority('medium');
      setChannels([]);
      setCustomMessage('');
      setScheduleDate(null);
      setSelectedRowKeys([]);
      setDrawerVisible(false);
    } catch (error) {
      message.error('Có lỗi xảy ra khi gửi thông báo!');
    } finally {
      setIsLoading(false);
    }
  }, [selectedRowKeys, notificationType, priority, channels, scheduleDate]);

  // Enhanced group saving
  const saveGroup = useCallback(() => {
    if (!groupName.trim() || selectedRowKeys.length === 0) {
      message.error('Vui lòng nhập tên nhóm và chọn ít nhất một người nhận!');
      return;
    }

    const newGroup: SavedGroup = {
      name: groupName.trim(),
      keys: [...selectedRowKeys],
      description: groupDescription.trim(),
      createdAt: new Date().toISOString(),
    };

    setSavedGroups(prev => [...prev, newGroup]);
    message.success(`Nhóm "${groupName}" đã được lưu với ${selectedRowKeys.length} thành viên!`);
    setGroupName('');
    setGroupDescription('');
  }, [groupName, groupDescription, selectedRowKeys]);

  // Quick select functions
  const selectAll = () => setSelectedRowKeys(recipients.map(r => r.key));
  const selectNone = () => setSelectedRowKeys([]);
  const selectWarningStudents = () => {
    const warningKeys = recipients.filter(r => r.status === 'Cảnh báo').map(r => r.key);
    setSelectedRowKeys(warningKeys);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Title level={1} className={`mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              🔔 Hệ thống thông báo thông minh
            </Title>
            <Text type="secondary">
              Quản lý và gửi thông báo đến sinh viên một cách hiệu quả
            </Text>
          </div>
          <Space>
            <Switch
              checkedChildren="🌙"
              unCheckedChildren="☀️"
              checked={darkMode}
              onChange={setDarkMode}
              size='default'
            />
            <Badge count={history.length} showZero color="#1890ff">
              <Button icon={<HistoryOutlined />}>Lịch sử</Button>
            </Badge>
          </Space>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
            <Statistic
              title="Tổng số sinh viên"
              value={stats.total}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
          <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
            <Statistic
              title="Đã chọn"
              value={stats.selected}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
          <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
            <Statistic
              title="Cần cảnh báo"
              value={stats.warningStudents}
              prefix={<BellOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
          <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
            <Statistic
              title="Điểm TB trung bình"
              value={stats.avgGPA}
              precision={1}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </div>

        {/* Smart Suggestions */}
        {selectedRowKeys.length > 0 && (
          <Alert
            message="Gợi ý thông minh"
            description={`Dựa trên đối tượng đã chọn, chúng tôi khuyến nghị gửi thông báo: ${
              notificationTypes.find(t => t.value === suggestedType)?.label
            }`}
            type="info"
            showIcon
            className="mb-6"
            action={
              <Button size="small" onClick={() => setDrawerVisible(true)}>
                Tạo ngay
              </Button>
            }
          />
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Create Notification Panel */}
          <Card 
            title="📝 Tạo thông báo mới"
            className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-lg`}
          >
            <Space direction="vertical" size="large" className="w-full">
              <Button
                type="primary"
                size="large"
                icon={<SendOutlined />}
                onClick={() => setDrawerVisible(true)}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 border-0"
                disabled={selectedRowKeys.length === 0}
              >
                Tạo thông báo
              </Button>
              
              <div>
                <Text strong>Loại thông báo được gợi ý:</Text>
                <div className="mt-2">
                  {notificationTypes.map(type => (
                    <Tag
                      key={type.value}
                      color={type.value === suggestedType ? type.color : 'default'}
                      className="mb-2"
                    >
                      {type.icon} {type.label}
                    </Tag>
                  ))}
                </div>
              </div>

              <Divider />

              <div>
                <Text strong className="block mb-2">Thao tác nhanh:</Text>
                <Space wrap>
                  <Button size="small" onClick={selectAll}>Chọn tất cả</Button>
                  <Button size="small" onClick={selectNone}>Bỏ chọn</Button>
                  <Button size="small" onClick={selectWarningStudents} type="dashed">
                    Chọn SV cảnh báo
                  </Button>
                </Space>
              </div>
            </Space>
          </Card>

          {/* Recipient Selection Panel */}
          <Card 
            title="👥 Chọn đối tượng nhận"
            className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-lg xl:col-span-2`}
          >
            <Space direction="vertical" size="middle" className="w-full">
              {/* Search and Group Management */}
              <div className="flex flex-wrap gap-4">
                <Input
                  placeholder="🔍 Tìm kiếm sinh viên..."
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  className="flex-1 min-w-64"
                  allowClear
                />
                <Input
                  placeholder="Tên nhóm mới"
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  className="w-48"
                />
                <Button 
                  icon={<SaveOutlined />} 
                  onClick={saveGroup}
                  disabled={!groupName || selectedRowKeys.length === 0}
                >
                  Lưu nhóm
                </Button>
              </div>

              {/* Saved Groups */}
              {savedGroups.length > 0 && (
                <div>
                  <Text strong>Nhóm đã lưu:</Text>
                  <div className="mt-2">
                    {savedGroups.map(group => (
                      <Tag
                        key={group.name}
                        color="blue"
                        className="mb-2 cursor-pointer"
                        onClick={() => setSelectedRowKeys(group.keys)}
                      >
                        {group.name} ({group.keys.length})
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              {/* Recipients Table */}
              <Table
                rowSelection={{
                  selectedRowKeys,
                  onChange: setSelectedRowKeys,
                  selections: [
                    Table.SELECTION_ALL,
                    Table.SELECTION_INVERT,
                    Table.SELECTION_NONE,
                  ],
                }}
                columns={columns}
                dataSource={filteredRecipients}
                pagination={{ 
                  pageSize: 8,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => 
                    `${range[0]}-${range[1]} của ${total} sinh viên`
                }}
                scroll={{ x: true }}
                className={darkMode ? 'dark-table' : ''}
              />
            </Space>
          </Card>
        </div>

        {/* History Panel */}
        {history.length > 0 && (
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
        )}
      </div>

      {/* Enhanced Notification Drawer */}
      <Drawer
        title="✨ Tạo thông báo mới"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={500}
        className={darkMode ? 'dark-drawer' : ''}
      >
        <div className="space-y-6">
          <Alert
            message={`Sẽ gửi đến ${selectedRowKeys.length} người nhận`}
            type="info"
            showIcon
          />

          <div>
            <Text strong className="block mb-2">Loại thông báo *</Text>
            <Select 
              placeholder="Chọn loại thông báo" 
              size="large"
              className="w-full"
              value={notificationType}
              onChange={setNotificationType}
            >
              {notificationTypes.map(type => (
                <Option key={type.value} value={type.value}>
                  <Space>
                    <span>{type.icon}</span>
                    <span>{type.label}</span>
                  </Space>
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <Text strong className="block mb-2">Mức độ ưu tiên *</Text>
            <Select 
              placeholder="Chọn mức độ ưu tiên" 
              size="large"
              className="w-full"
              value={priority}
              onChange={setPriority}
            >
              {priorities.map(p => (
                <Option key={p.value} value={p.value}>
                  <div className="flex justify-between items-center">
                    <Tag color={p.color}>{p.label}</Tag>
                    <Progress percent={p.percentage} size="small" showInfo={false} />
                  </div>
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <Text strong className="block mb-2">Kênh gửi *</Text>
            <Select 
              mode="multiple" 
              placeholder="Chọn kênh gửi" 
              size="large"
              className="w-full"
              value={channels}
              onChange={setChannels}
            >
              {channelOptions.map(c => (
                <Option key={c.value} value={c.value}>
                  <Space>
                    <span>{c.icon}</span>
                    <span>{c.label}</span>
                  </Space>
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <Text strong className="block mb-2">Nội dung tùy chỉnh (tùy chọn)</Text>
            <TextArea 
              rows={4} 
              placeholder="Nhập nội dung thông báo tùy chỉnh..."
              showCount
              maxLength={500}
              value={customMessage}
              onChange={e => setCustomMessage(e.target.value)}
            />
          </div>

          <div>
            <Text strong className="block mb-2">Lên lịch gửi (tùy chọn)</Text>
            <DatePicker 
              showTime 
              placeholder="Chọn thời gian gửi" 
              className="w-full"
              size="large"
              value={scheduleDate}
              onChange={setScheduleDate}
            />
          </div>

          <Button 
            type="primary" 
            icon={<SendOutlined />} 
            onClick={onFinish}
            loading={isLoading} 
            block
            size="large"
            className="h-12 bg-gradient-to-r from-blue-500 to-purple-600 border-0"
          >
            {isLoading ? 'Đang gửi...' : 'Gửi thông báo'}
          </Button>
        </div>
      </Drawer>
    </div>
  );
};

export default EnhancedNotificationSystem;