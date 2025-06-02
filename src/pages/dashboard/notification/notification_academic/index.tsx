import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  Button, 
  Table, 
  Tag, 
  Typography, 
  message, 
  Input, 
  Switch,
  Card,
  Space,
  Divider,
  Alert,
  Badge
} from 'antd';
import { 
  SendOutlined, 
  SaveOutlined, 
  HistoryOutlined,
} from '@ant-design/icons';


// Import components
import StatisticsCards from './StatisticsCards';
import NotificationHistoryComponent from './NotificationHistory';
import NotificationDrawer from './NotificationDrawer';

// Import data and constants
import { recipients } from '../data/recipientsData';
import { columns } from './TableColumns';
import { notificationTypes } from '../constants/notificationConstants';
import { NotificationHistory, SavedGroup } from '../../../../types/Notification';

const { Title, Text } = Typography;

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

  // Prepare table columns with dynamic filters
  const tableColumns = useMemo(() => {
    const updatedColumns = [...columns];
    
    // Add dynamic filters for faculty and status
    const facultyColumn: any = updatedColumns.find(col => col.key === 'faculty');
    if (facultyColumn) {
      facultyColumn.filters = [...new Set(recipients.map(r => r.faculty))].map(f => ({ 
        text: f, 
        value: f 
      }));
    }
    
    const statusColumn: any = updatedColumns.find(col => col.key === 'status');
    if (statusColumn) {
      statusColumn.filters = [...new Set(recipients.map(r => r.status))].map(s => ({ 
        text: s, 
        value: s 
      }));
    }
    
    return updatedColumns;
  }, []);

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
        <StatisticsCards 
          total={stats.total}
          selected={stats.selected}
          warningStudents={stats.warningStudents}
          avgGPA={stats.avgGPA}
          darkMode={darkMode}
        />

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
                columns={tableColumns}
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
        <NotificationHistoryComponent 
          history={history}
          darkMode={darkMode}
        />
      </div>

      {/* Enhanced Notification Drawer */}
      <NotificationDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        selectedRowKeys={selectedRowKeys}
        notificationType={notificationType}
        setNotificationType={setNotificationType}
        priority={priority}
        setPriority={setPriority}
        channels={channels}
        setChannels={setChannels}
        customMessage={customMessage}
        setCustomMessage={setCustomMessage}
        scheduleDate={scheduleDate}
        setScheduleDate={setScheduleDate}
        onFinish={onFinish}
        isLoading={isLoading}
        darkMode={darkMode}
      />
    </div>
  );
};

export default EnhancedNotificationSystem;