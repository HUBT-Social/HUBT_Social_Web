import { HistoryOutlined, SaveOutlined, SendOutlined } from '@ant-design/icons';
import {
  Alert,
  Badge,
  Button,
  Card,
  Collapse,
  Divider,
  Input,
  Progress,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import { ColumnType } from 'antd/es/table';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { sendAcademicNotification } from '../../../../store/slices/notificationSlice';
import { getAverageScore, selectAverageScore } from '../../../../store/slices/studentSlice';
import { AppDispatch, store } from '../../../../store/store';
import { ChannelType, Notification, NotificationPriority, NotificationType, SavedGroup, SendNotificationByAcademic } from '../../../../types/Notification';
import { AcademicStatus } from '../../../../types/Student';
import { notificationTypeOptions as notificationTypes } from '../data/mockData';
import NotificationDrawer from './NotificationDrawer';
import StatisticsCards from './StatisticsCards';

const { Title, Text } = Typography;
const { Panel } = Collapse;

// Define calculateStatusAcademic
const calculateStatusAcademic = (gpa10: number): AcademicStatus => {
  if (gpa10 >= 9.0) return 'Excellent';
  if (gpa10 >= 8.0) return 'VeryGood';
  if (gpa10 >= 7.0) return 'Good';
  if (gpa10 >= 6.5) return 'FairlyGood';
  if (gpa10 >= 5.0) return 'Average';
  if (gpa10 >= 4.0) return 'Weak';
  return 'Warning';
};

// Define columns for the Table
const columns: ColumnType<AverageScore>[] = [
  {
    title: 'Student Information',
    dataIndex: 'maSV',
    key: 'maSV',
    width: 280,
    fixed: 'left',
    render: (_: string, record: AverageScore) => record.maSV,
  },
  {
    title: 'GPA',
    dataIndex: 'diemTB10',
    key: 'diemTB10',
    width: 120,
    sorter: (a: AverageScore, b: AverageScore) => a.diemTB10 - b.diemTB10,
    render: (diemTB10: number) => (
      <div style={{ minWidth: 80 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
          <Text strong style={{ color: getGPAColor(diemTB10), marginRight: 8 }}>
            {diemTB10}
          </Text>
          <Badge
            count={diemTB10 >= 8 ? '⭐' : diemTB10 >= 7 ? '👍' : diemTB10 >= 5 ? '⚠️' : '❌'}
            style={{ backgroundColor: 'transparent' }}
          />
        </div>
        <Progress
          percent={Math.min(diemTB10 * 10, 100)}
          size="small"
          showInfo={false}
          strokeColor={getGPAColor(diemTB10)}
          style={{ margin: 0 }}
        />
      </div>
    ),
  },
  {
    title: 'Academic Status',
    dataIndex: 'academicStatus',
    key: 'academicStatus',
    width: 160,
    filters: [
      { text: 'Excellent', value: 'Excellent' },
      { text: 'Very Good', value: 'VeryGood' },
      { text: 'Good', value: 'Good' },
      { text: 'Fairly Good', value: 'FairlyGood' },
      { text: 'Average', value: 'Average' },
      { text: 'Weak', value: 'Weak' },
      { text: 'Warning', value: 'Warning' },
    ],
    onFilter: (value, record: AverageScore) =>
      typeof value === 'string' && record.academicStatus === value,
    render: (status: string) => (
      <Tag color={status ? getStatusColor(status as AcademicStatus) : 'default'} style={{ margin: 0 }}>
        {status || 'Unspecified'}
      </Tag>
    ),
  },
];

// Mock getGPAColor and getStatusColor
const getGPAColor = (gpa: number): string => {
  if (gpa >= 8) return '#52c41a';
  if (gpa >= 7) return '#1890ff';
  if (gpa >= 5) return '#faad14';
  return '#ff4d4f';
};

const getStatusColor = (status: AcademicStatus): string => {
  switch (status) {
    case 'Excellent': return 'green';
    case 'VeryGood': return 'cyan';
    case 'Good': return 'blue';
    case 'FairlyGood': return 'geekblue';
    case 'Average': return 'gold';
    case 'Weak': return 'orange';
    case 'Warning': return 'red';
    default: return 'default';
  }
};

interface AverageScore {
  maSV: string;
  diemTB10: number;
  diemTB4: number;
  academicStatus: string;
}

/**
 * Main component for the smart notification system.
 */
const EnhancedNotificationSystem: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isSelectAll, setSelectAll] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [savedGroups, setSavedGroups] = useState<SavedGroup[]>([]);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [history] = useState<Notification[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Form values
  const [notificationType, setNotificationType] = useState<NotificationType | ''>('');
  const [priority, setPriority] = useState<NotificationPriority>('medium');
  const [channels, setChannels] = useState<ChannelType[]>([]);
  const [customMessage, setCustomMessage] = useState('');
  const [scheduleDate, setScheduleDate] = useState<string | null>(null);
  const recipients = useSelector(selectAverageScore);
  const dispatch = useDispatch<AppDispatch>();

  const fetchAverageScore = async () => {
    const currentMargeStudent = store.getState().students.averageScore.length;
    console.log("Current student marge: ", currentMargeStudent);
    try {
      await dispatch(getAverageScore());
      await new Promise((resolve) => {
        const unsubscribe = store.subscribe(() => {
          const newCount = store.getState().students.averageScore.length;
          if (newCount > currentMargeStudent) {
            unsubscribe();
            resolve(true);
          }
          console.log("Current std: ", newCount);
        });
      });
    } catch {
      console.log("Loi lay diem nguoi dung");
    }
  };

  useEffect(() => {
    console.log('Check get scores');
    if (recipients.length === 0) {
      fetchAverageScore();
    }
  }, []);

  // Preprocess recipients to include academicStatus
  const processedRecipients = useMemo(() => {
    return recipients.map(recipient => ({
      ...recipient,
      academicStatus: calculateStatusAcademic(recipient.diemTB10),
    }));
  }, [recipients]);


  // Enhanced filtering
  const filteredRecipients = useMemo(() => {
    if (!searchText) return processedRecipients;
    return processedRecipients.filter(r =>
      r.maSV.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [processedRecipients, searchText]);

  // Smart suggestion based on context
  // Smart suggestion based on context
const suggestedType = useMemo(() => {
  const selectedGPAs = selectedRowKeys.map(key =>
    processedRecipients.find(r => r.maSV === key)?.diemTB10 || 0
  );
  const avgGPA = selectedGPAs.length > 0
    ? selectedGPAs.reduce((a, b) => a + b, 0) / selectedGPAs.length
    : 0;

  // Lấy danh sách trạng thái học tập của các sinh viên được chọn
  const selectedStatuses = selectedRowKeys.map(key =>
    processedRecipients.find(r => r.maSV === key)?.academicStatus || ''
  );

  // Đếm số sinh viên ở mỗi trạng thái học tập
  const warningCount = selectedStatuses.filter(status => status === 'Warning').length;
  const excellentCount = selectedStatuses.filter(status => status === 'Excellent').length;
  const totalSelected = selectedRowKeys.length;
  const totalRecipients = processedRecipients.length;

  // Điều kiện 1: Nếu điểm trung bình dưới 5.0, gợi ý thông báo cảnh báo
  if (avgGPA < 5.0) {
    return 'warning';
  }

  // Điều kiện 2: Nếu hơn 50% sinh viên được chọn có trạng thái 'Warning', gợi ý thông báo cảnh báo
  if (totalSelected > 0 && warningCount / totalSelected > 0.5) {
    return 'warning';
  }

  // Điều kiện 3: Nếu hơn 50% sinh viên được chọn có trạng thái 'Excellent', gợi ý thông báo khen thưởng
  if (totalSelected > 0 && excellentCount / totalSelected > 0.5) {
    return 'achievement';
  }

  // Điều kiện 4: Nếu chọn toàn bộ sinh viên, gợi ý thông báo sự kiện chung
  if (totalSelected === totalRecipients && totalSelected > 0) {
    return 'event';
  }

  // Điều kiện 5: Nếu chọn ít hơn 10% tổng số sinh viên, gợi ý thông báo cá nhân
  if (totalSelected > 0 && totalSelected / totalRecipients < 0.1) {
    return 'personal';
  }

  // Điều kiện 6: Nếu điểm trung bình từ 7.0 trở lên, gợi ý thông báo khuyến khích
  if (avgGPA >= 7.0) {
    return 'encouragement';
  }

  // Mặc định: Gợi ý thông báo sự kiện
  return 'event';
}, [selectedRowKeys, processedRecipients]);

  // Statistics
  const stats = useMemo(() => {
    const total = processedRecipients.length;
    const selected = selectedRowKeys.length;
    const warningStudents = processedRecipients.filter(r => r.academicStatus === 'Warning').length;
    const avgGPA = processedRecipients.length > 0
      ? processedRecipients.reduce((sum, r) => sum + r.diemTB10, 0) / processedRecipients.length
      : 0;

    return { total, selected, warningStudents, avgGPA };
  }, [processedRecipients, selectedRowKeys]);

  // Handle form submission
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
      const payload: SendNotificationByAcademic = {
        type: notificationType,
        body: customMessage,
        channels,
        priority,
        recipients: isSelectAll ? [] : selectedRowKeys as string[],
        sendAll: isSelectAll,
        timestamp: new Date().toISOString(),
      };
      console.log('Payload: ', payload);

      const response = await dispatch(sendAcademicNotification({ payload }));
      console.log('Response: ', response);
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
      setSelectedTags([]);
      setDrawerVisible(false);
    } catch (error) {
      message.error('An error occurred while sending the notification!');
    } finally {
      setIsLoading(false);
    }
  }, [selectedRowKeys, notificationType, priority, channels, scheduleDate, processedRecipients, dispatch]);

  // Save group
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

  // Delete group
  const deleteGroup = useCallback((groupName: string) => {
    setSavedGroups(prev => prev.filter(group => group.name !== groupName));
    message.success(`Group "${groupName}" deleted successfully!`);
  }, []);

  // Quick select functions
  const selectAll = useCallback(() => {
    setSelectedRowKeys(processedRecipients.map(r => r.maSV));
    setSelectAll(true);
    setSelectedTags(['Select All']);
  }, [processedRecipients]);

  const selectNone = useCallback(() => {
    setSelectedRowKeys([]);
    setSelectAll(false);
    setSelectedTags([]);
  }, []);

  const selectWarningStudents = useCallback(() => {
    const warningKeys = processedRecipients.filter(r => r.academicStatus === 'Warning').map(r => r.maSV);
    setSelectedRowKeys(warningKeys);
    setSelectAll(false);
    setSelectedTags(['Select Warning Students']);
  }, [processedRecipients]);

  const selectExcellentStudents = useCallback(() => {
    const excellentKeys = processedRecipients.filter(r => r.academicStatus === 'Excellent').map(r => r.maSV);
    setSelectedRowKeys(excellentKeys);
    setSelectAll(false);
    setSelectedTags(['Select Excellent Students']);
  }, [processedRecipients]);

  const selectVeryGoodStudents = useCallback(() => {
    const excellentKeys = processedRecipients.filter(r => r.academicStatus === 'VeryGood').map(r => r.maSV);
    setSelectedRowKeys(excellentKeys);
    setSelectAll(false);
    setSelectedTags(['Select Very Good Students']);
  }, [processedRecipients]);

  const selectGoodStudents = useCallback(() => {
    const excellentKeys = processedRecipients.filter(r => 
      r.academicStatus === 'VeryGood' || 
      r.academicStatus === 'FairlyGood' ||
      r.academicStatus === 'Excellent' ||
      r.academicStatus === 'Good'
    ).map(r => r.maSV);
    setSelectedRowKeys(excellentKeys);
    setSelectAll(false);
    setSelectedTags(['Select Very Good Students']);
  }, [processedRecipients]);

  // Handle tag selection
  const handleTagChange = useCallback((tag: string, checked: boolean) => {
    setSelectedTags(prev => {
      if (checked) {
        if (tag === 'Select All') {
          selectAll();
          return ['Select All'];
        }
        if (tag === 'Clear Selection') {
          selectNone();
          return ['Clear Selection'];
        }
        if (tag === 'Select Warning Students') {
          selectWarningStudents();
          return ['Select Warning Students'];
        }
        if (tag === 'Select Excellent Students') {
          selectExcellentStudents();
          return ['Select Excellent Students'];
        }
        if (tag === 'Select Very Good Students') {
          selectVeryGoodStudents();
          return ['Select Very Good Students'];
        }
        if (tag === 'Good Students') {
          selectGoodStudents();
          return ['Good Students'];
        }
      } else {
        selectNone();
        return [];
      }
      return prev;
    });
  }, [selectAll, selectNone, selectWarningStudents, selectExcellentStudents]);

  const tags = ['Select All', 'Clear Selection', 'Select Warning Students', 'Select Excellent Students','Select Very Good Students','Good Students'];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
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
              notificationTypes.find(t => t.value === suggestedType)?.label || 'general'
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
                      className="mb-5"
                    >
                      {type.label}
                    </Tag>
                  ))}
                </div>
              </div>

              <Divider />

              <div>
                <Text strong className="block mb-2">Quick Actions:</Text>
                <Space wrap>
                  {tags.map((tag) => (
                    <Tag.CheckableTag
                      key={tag}
                      checked={selectedTags.includes(tag)}
                      onChange={(checked) => handleTagChange(tag, checked)}
                      style={{
                        border: '1px dashed #d9d9d9',
                        padding: '0 8px',
                        cursor: 'pointer',
                        backgroundColor: selectedTags.includes(tag) ? '#e6f7ff' : 'transparent',
                      }}
                    >
                      {tag}
                    </Tag.CheckableTag>
                  ))}
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

              {savedGroups.length > 0 && (
                <div>
                  <Text strong>Saved Groups:</Text>
                  <div className="mt-2">
                    {savedGroups.map(group => (
                      <Tag
                        key={group.name}
                        color="blue"
                        closable
                        onClose={() => deleteGroup(group.name)}
                        className="mb-2 cursor-pointer"
                        onClick={() => setSelectedRowKeys(group.keys)}
                      >
                        {group.name} ({group.keys.length})
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              <Table
                rowKey="maSV"
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
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} students`,
                }}
                scroll={{ x: true }}
                className={darkMode ? 'dark-table' : ''}
              />
            </Space>
          </Card>
        </div>

        {/* History Panel */}
        <Card
          title="📜 Notification History"
          className={`mt-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-lg`}
        >
          {history.length === 0 ? (
            <Text type="secondary">No notifications sent yet.</Text>
          ) : (
            <Collapse>
              {history.map((notification, index) => (
                <Panel
                  header={`Notification #${history.length - index} - ${notification.type} (${new Date(notification.time).toLocaleString()})`}
                  key={index}
                >
                  <p><strong>Message:</strong> {notification.body}</p>
                  <p><strong>Priority:</strong> {notification.priority}</p>
                  <p><strong>Recipients:</strong> {notification.recipients} students</p>
                </Panel>
              ))}
            </Collapse>
          )}
        </Card>

        {/* Notification Drawer */}
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