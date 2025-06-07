
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
  Badge,
} from 'antd';
import { SendOutlined, SaveOutlined, HistoryOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

// Import components
import StatisticsCards from './StatisticsCards';
import NotificationDrawer from './NotificationDrawer';

// Import data and constants
import { columns } from './TableColumns';
import { NotificationTypeOption, NotificationHistory, SavedGroup, NotificationType, NotificationPriority, ChannelType } from '../../../../types/Notification';
import { selectMergeStudentsWithScores } from '../../../../store/slices/studentSlice';
import { createFullName } from '../../../../types/Student';

const { Title, Text } = Typography;

// Notification type options (mock data, can be moved to constants file)
const notificationTypes: NotificationTypeOption[] = [
  { value: 'academic', label: 'Academic', color: 'blue', bgColor: '#e6f7ff', icon: '📚', gradient: 'from-blue-500 to-blue-300' },
  { value: 'attendance', label: 'Attendance', color: 'orange', bgColor: '#fff7e6', icon: '🔔', gradient: 'from-orange-500 to-orange-300' },
  { value: 'warning', label: 'Warning', color: 'red', bgColor: '#fff1f0', icon: '⚠️', gradient: 'from-red-500 to-red-300' },
  { value: 'event', label: 'Event', color: 'green', bgColor: '#f6ffed', icon: '🎉', gradient: 'from-green-500 to-green-300' },
  { value: 'tuition', label: 'Tuition', color: 'purple', bgColor: '#f9f0ff', icon: '💰', gradient: 'from-purple-500 to-purple-300' },
];

/**
 * Props for the EnhancedNotificationSystem component.
 */
interface EnhancedNotificationSystemProps {
  apiEndpoint?: string; // Optional API endpoint for sending notifications
}

/**
 * Main component for the smart notification system.
 */
const EnhancedNotificationSystem: React.FC<EnhancedNotificationSystemProps> = ({ }) => {
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
  const [notificationType, setNotificationType] = useState<NotificationType | ''>('');
  const [priority, setPriority] = useState<NotificationPriority>('medium');
  const [channels, setChannels] = useState<ChannelType[]>([]);
  const [customMessage, setCustomMessage] = useState('');
  const [scheduleDate, setScheduleDate] = useState<string | null>(null);

  const recipients = useSelector(selectMergeStudentsWithScores);

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
      createFullName(recipient).toLowerCase().includes(searchText.toLowerCase()) ||
      recipient.faculty.toLowerCase().includes(searchText.toLowerCase()) ||
      (recipient.className || '').toLowerCase().includes(searchText.toLowerCase())
    );
  }, [recipients, searchText]);

  // Smart suggestion based on context
  const suggestedType = useMemo(() => {
    const month = currentTime.getMonth();
    const date = currentTime.getDate();
    const selectedGPAs = selectedRowKeys.map(key =>
      recipients.find(r => r.userName === key)?.diemTB10 || 0
    );
    const avgGPA = selectedGPAs.length > 0
      ? selectedGPAs.reduce((a, b) => a + b, 0) / selectedGPAs.length
      : 0;

    if (avgGPA < 5.0) return 'warning';
    if (month === 8 || month === 1) return 'tuition';
    if (date > 20) return 'attendance';
    return 'event';
  }, [currentTime, selectedRowKeys, recipients]);

  // Prepare table columns with dynamic filters
  const tableColumns = useMemo(() => {
    const updatedColumns = [...columns];

    const facultyColumn = updatedColumns.find(col => col.key === 'faculty');
    if (facultyColumn) {
      facultyColumn.filters = [...new Set(recipients.map(r => r.faculty))].map(f => ({
        text: f,
        value: f,
      }));
    }

    const statusColumn = updatedColumns.find(col => col.key === 'academicStatus');
    if (statusColumn) {
      statusColumn.filters = [...new Set(recipients.map(r => r.academicStatus))].map(s => ({
        text: s,
        value: s,
      }));
    }

    return updatedColumns;
  }, [recipients]);

  // Statistics
  const stats = useMemo(() => {
    const total = recipients.length;
    const selected = selectedRowKeys.length;
    const warningStudents = recipients.filter(r => r.status === 'Warning').length;
    const avgGPA = recipients.length > 0
      ? recipients.reduce((sum, r) => sum + r.diemTB10, 0) / recipients.length
      : 0;

    return { total, selected, warningStudents, avgGPA };
  }, [recipients, selectedRowKeys]);

  // Handle form submission with enhanced validation
  const onFinish = useCallback(async () => {
    if (selectedRowKeys.length === 0) {
      message.error('Please select at least one recipient!');
      return;
    }

    if (!notificationType) {
      message.error('Please select a notification type!');
      return;
    }

    if (channels.length === 0) {
      message.error('Please select at least one delivery channel!');
      return;
    }

    setIsLoading(true);
    try {
      const notification: NotificationHistory = {
        id: Math.random().toString(36).substr(2, 9),
        type: notificationType,
        priority,
        recipients: selectedRowKeys.map(String),
        timestamp: scheduleDate || new Date().toISOString(),
        readRate: Math.floor(Math.random() * 100),
        deliveryStatus: 'sent',
        channels: channels,
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setHistory(prev => [notification, ...prev]);
      message.success({
        content: `Notification sent successfully to ${selectedRowKeys.length} recipients!`,
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
      message.error('An error occurred while sending the notification!');
    } finally {
      setIsLoading(false);
    }
  }, [selectedRowKeys, notificationType, priority, channels, scheduleDate]);

  // Enhanced group saving
  const saveGroup = useCallback(() => {
    if (!groupName.trim() || selectedRowKeys.length === 0) {
      message.error('Please enter a group name and select at least one recipient!');
      return;
    }

    const newGroup: SavedGroup = {
      name: groupName.trim(),
      keys: [...selectedRowKeys],
      description: groupDescription.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    setSavedGroups(prev => [...prev, newGroup]);
    message.success(`Group "${groupName}" saved with ${selectedRowKeys.length} members!`);
    setGroupName('');
    setGroupDescription('');
  }, [groupName, groupDescription, selectedRowKeys]);

  // Quick select functions
  const selectAll = useCallback(() => setSelectedRowKeys(recipients.map(r => r.userName)), [recipients]);
  const selectNone = useCallback(() => setSelectedRowKeys([]), []);
  const selectWarningStudents = useCallback(() => {
    const warningKeys = recipients.filter(r => r.academicStatus === 'Warning').map(r => r.userName);
    setSelectedRowKeys(warningKeys);
  }, [recipients]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
      }`}
    >
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Title level={1} className={`mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              🔔 Smart Notification System
            </Title>
            <Text type="secondary">Manage and send notifications to students efficiently</Text>
          </div>
          <Space>
            <Switch
              checkedChildren="🌙"
              unCheckedChildren="☀️"
              checked={darkMode}
              onChange={setDarkMode}
            />
            <Badge count={history.length} showZero color="#1890ff">
              <Button icon={<HistoryOutlined />}>History</Button>
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
            message="Smart Suggestion"
            description={`Based on the selected recipients, we recommend sending a ${
              notificationTypes.find(t => t.value === suggestedType)?.label
            } notification`}
            type="info"
            showIcon
            className="mb-6"
            action={
              <Button size="small" onClick={() => setDrawerVisible(true)}>
                Create Now
              </Button>
            }
          />
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Create Notification Panel */}
          <Card
            title="📝 Create New Notification"
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
                Create Notification
              </Button>

              <div>
                <Text strong>Suggested Notification Types:</Text>
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
                <Text strong className="block mb-2">Quick Actions:</Text>
                <Space wrap>
                  <Button size="small" onClick={selectAll}>Select All</Button>
                  <Button size="small" onClick={selectNone}>Clear Selection</Button>
                  <Button size="small" onClick={selectWarningStudents} type="dashed">
                    Select Warning Students
                  </Button>
                </Space>
              </div>
            </Space>
          </Card>

          {/* Recipient Selection Panel */}
          <Card
            title="👥 Select Recipients"
            className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-lg xl:col-span-2`}
          >
            <Space direction="vertical" size="middle" className="w-full">
              {/* Search and Group Management */}
              <div className="flex flex-wrap gap-4">
                <Input
                  placeholder="🔍 Search students..."
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  className="flex-1 min-w-64"
                  allowClear
                />
                <Input
                  placeholder="New group name"
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  className="w-48"
                />
                <Button
                  icon={<SaveOutlined />}
                  onClick={saveGroup}
                  disabled={!groupName || selectedRowKeys.length === 0}
                >
                  Save Group
                </Button>
              </div>

              {/* Saved Groups */}
              {savedGroups.length > 0 && (
                <div>
                  <Text strong>Saved Groups:</Text>
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
                rowKey={'userName'}
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
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} students`,
                }}
                scroll={{ x: true }}
                className={darkMode ? 'dark-table' : ''}
              />
            </Space>
          </Card>
        </div>

        {/* History Panel */}

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
    </div>
  );
};

export default EnhancedNotificationSystem;
