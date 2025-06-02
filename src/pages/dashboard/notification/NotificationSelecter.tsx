import {
  BellOutlined,
  BookOutlined,
  BulbOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  CrownOutlined,
  DashboardOutlined,
  DesktopOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  FilterOutlined,
  FireOutlined,
  GlobalOutlined,
  HistoryOutlined,
  InfoCircleOutlined,
  MailOutlined,
  MessageOutlined,
  MobileOutlined,
  PieChartOutlined,
  ScheduleOutlined,
  SearchOutlined,
  SendOutlined,
  SettingOutlined,
  StarOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
  UploadOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  WarningOutlined
} from '@ant-design/icons';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Collapse,
  DatePicker,
  Input,
  List,
  Modal,
  Progress,
  Radio,
  Row,
  Select,
  Space,
  Statistic,
  Switch,
  Tabs,
  Tag,
  Timeline,
  Typography,
  Upload
} from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';

const { TextArea } = Input;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Title, Text } = Typography;

// Mock notification types with enhanced styling
const notificationTypeOptions = [
  { value: 'default', label: 'Default', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: <BellOutlined />, gradient: 'from-gray-400 to-gray-600' },
  { value: 'event', label: 'Event', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: <CalendarOutlined />, gradient: 'from-blue-400 to-blue-600' },
  { value: 'warning', label: 'Warning', color: 'text-red-600', bgColor: 'bg-red-100', icon: <WarningOutlined />, gradient: 'from-red-400 to-red-600' },
  { value: 'announcement', label: 'Announcement', color: 'text-green-600', bgColor: 'bg-green-100', icon: <MessageOutlined />, gradient: 'from-green-400 to-green-600' },
  { value: 'reminder', label: 'Reminder', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: <ClockCircleOutlined />, gradient: 'from-yellow-400 to-yellow-600' },
  { value: 'urgent', label: 'Urgent', color: 'text-purple-600', bgColor: 'bg-purple-100', icon: <ThunderboltOutlined />, gradient: 'from-purple-400 to-purple-600' },
  { value: 'success', label: 'Success', color: 'text-emerald-600', bgColor: 'bg-emerald-100', icon: <CheckCircleOutlined />, gradient: 'from-emerald-400 to-emerald-600' },
  { value: 'info', label: 'Information', color: 'text-cyan-600', bgColor: 'bg-cyan-100', icon: <InfoCircleOutlined />, gradient: 'from-cyan-400 to-cyan-600' },
];

// Mock data for enhanced features
const mockRecentNotifications = [
  { id: 1, title: 'Welcome to new semester', type: 'announcement', recipients: 1250, time: '2 hours ago', status: 'sent' },
  { id: 2, title: 'Assignment due reminder', type: 'reminder', recipients: 350, time: '1 day ago', status: 'delivered' },
  { id: 3, title: 'Emergency maintenance', type: 'urgent', recipients: 2500, time: '2 days ago', status: 'read' },
  { id: 4, title: 'Sports event registration', type: 'event', recipients: 800, time: '3 days ago', status: 'sent' },
];

const mockStats = {
  totalSent: 15420,
  todaySent: 45,
  deliveryRate: 98.5,
  readRate: 76.3
};

const NotificationSender = () => {
  // Existing form state
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageFile, setImageFile] = useState<any>(null);
  const [requestId, setRequestId] = useState('');
  const [type, setType] = useState('default');
  const [recipientType, setRecipientType] = useState('all');
  const [facultyCodes, setFacultyCodes] = useState<string[]>([]);
  const [courseCodes, setCourseCodes] = useState<any[]>([]);
  const [classCodes, setClassCodes] = useState<string[]>([]);
  const [userNames, setUserNames] = useState<string[]>([]);
  
  // Enhanced UI state
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [notification, setNotification] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('compose');
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<any>(null);
  const [priority, setPriority] = useState('normal');
  const [deliveryChannels, setDeliveryChannels] = useState(['push']);
  const [templateMode, setTemplateMode] = useState(false);
  const [, setSelectedTemplate] = useState<any>(null);
  const [previewDevice, setPreviewDevice] = useState('mobile');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Mock data
  type User = {
  userName: string;
  className: string;
  fullName: string;
  avatar: string;
  role: 'student' | 'teacher';
};

const [users] = useState<User[]>([
  {
    userName: 'john_doe',
    className: 'CS2023A',
    fullName: 'John Doe',
    avatar: '',
    role: 'student',
  },
  {
    userName: 'jane_smith',
    className: 'IT2022B',
    fullName: 'Jane Smith',
    avatar: '',
    role: 'student',
  },
  {
    userName: 'prof_wilson',
    className: 'IT2022B',
    fullName: 'Prof. Wilson',
    avatar: '',
    role: 'teacher',
  },
]);

  // Extract faculties from class names (existing logic)
  const faculties = useMemo(() => {
    const facultiesSet = new Set();
    users.forEach(user => {
      if (user.className) {
        const facultyMatch = user.className.match(/^([A-Z]+)/);
        if (facultyMatch) facultiesSet.add(facultyMatch[1]);
      }
    });
    return Array.from(facultiesSet).sort();
  }, [users]);

  // Extract courses based on selected faculties (existing logic)
  const availableCourses = useMemo(() => {
    if (!facultyCodes.length) {
      const coursesSet = new Set();
      users.forEach(user => {
        if (user.className) {
          const courseMatch = user.className.match(/[A-Z]+(\d+)/);
          if (courseMatch) coursesSet.add(courseMatch[1]);
        }
      });
      return Array.from(coursesSet).sort();
    }

    const coursesSet = new Set();
    users.forEach(user => {
      if (user.className) {
        const facultyMatch = user.className.match(/^([A-Z]+)/);
        const courseMatch = user.className.match(/[A-Z]+(\d+)/);
        const faculty = facultyMatch ? facultyMatch[1] : '';
        if (facultyCodes.includes(faculty) && courseMatch) {
          coursesSet.add(courseMatch[1]);
        }
      }
    });
    return Array.from(coursesSet).sort();
  }, [users, facultyCodes]);

  // Extract classes based on selected faculties and courses (existing logic)
  const availableClasses = useMemo(() => {
    if (!facultyCodes.length && !courseCodes.length) {
      const classesSet = new Set();
      users.forEach(user => {
        if (user.className) classesSet.add(user.className);
      });
      return Array.from(classesSet).sort();
    }

    const classesSet = new Set();
    users.forEach(user => {
      if (user.className) {
        const facultyMatch = user.className.match(/^([A-Z]+)/);
        const courseMatch = user.className.match(/[A-Z]+(\d+)/);
        const faculty = facultyMatch ? facultyMatch[1] : '';
        const course = courseMatch ? courseMatch[1] : '';
        const matchesFaculty = !facultyCodes.length || facultyCodes.includes(faculty);
        const matchesCourse = !courseCodes.length || courseCodes.includes(course);
        if (matchesFaculty && matchesCourse) {
          classesSet.add(user.className);
        }
      }
    });
    return Array.from(classesSet).sort();
  }, [users, facultyCodes, courseCodes]);

  // Extract usernames based on all filters (existing logic)
  const availableUserNames = useMemo(() => {
    if (!facultyCodes.length && !courseCodes.length && !classCodes.length) {
      return users.map(user => user.userName).sort();
    }

    const userNamesSet = new Set();
    users.forEach(user => {
      if (user.className) {
        const facultyMatch = user.className.match(/^([A-Z]+)/);
        const courseMatch = user.className.match(/[A-Z]+(\d+)/);
        const faculty = facultyMatch ? facultyMatch[1] : '';
        const course = courseMatch ? courseMatch[1] : '';
        const matchesFaculty = !facultyCodes.length || facultyCodes.includes(faculty);
        const matchesCourse = !courseCodes.length || courseCodes.includes(course);
        const matchesClass = !classCodes.length || classCodes.includes(user.className);
        if (matchesFaculty && matchesCourse && matchesClass) {
          userNamesSet.add(user.userName);
        }
      } else if (!facultyCodes.length && !courseCodes.length && !classCodes.length) {
        userNamesSet.add(user.userName);
      }
    });
    return Array.from(userNamesSet).sort();
  }, [users, facultyCodes, courseCodes, classCodes]);

  // Filter users based on current selection (existing logic)
  const filteredUsers = useMemo(() => {
    if (recipientType === 'all') return users;

    return users.filter(user => {
      if (!user.className) return userNames.includes(user.userName);

      const facultyMatch = user.className.match(/^([A-Z]+)/);
      const courseMatch = user.className.match(/[A-Z]+(\d+)/);
      const faculty = facultyMatch ? facultyMatch[1] : '';
      const course = courseMatch ? courseMatch[1] : '';

      const matchesFaculty = !facultyCodes.length || facultyCodes.includes(faculty);
      const matchesCourse = !courseCodes.length || courseCodes.includes(course);
      const matchesClass = !classCodes.length || classCodes.includes(user.className);
      const matchesUserName = !userNames.length || userNames.includes(user.userName);

      return matchesFaculty && matchesCourse && matchesClass && matchesUserName;
    });
  }, [users, recipientType, facultyCodes, courseCodes, classCodes, userNames]);

  // Reset dependent selections when parent selections change (existing logic)
  useEffect(() => {
    if (facultyCodes.length) {
      const validCourseCodes = courseCodes.filter(code => availableCourses.includes(code));
      if (validCourseCodes.length !== courseCodes.length) {
        setCourseCodes(validCourseCodes);
      }
      const validClassCodes = classCodes.filter(code => availableClasses.includes(code));
      if (validClassCodes.length !== classCodes.length) {
        setClassCodes(validClassCodes);
      }
      const validUserNames = userNames.filter(name => availableUserNames.includes(name));
      if (validUserNames.length !== userNames.length) {
        setUserNames(validUserNames);
      }
    }
  }, [facultyCodes, availableCourses, availableClasses, availableUserNames, courseCodes, classCodes, userNames]);

  useEffect(() => {
    if (courseCodes.length) {
      const validClassCodes = classCodes.filter(code => availableClasses.includes(code));
      if (validClassCodes.length !== classCodes.length) {
        setClassCodes(validClassCodes);
      }
      const validUserNames = userNames.filter(name => availableUserNames.includes(name));
      if (validUserNames.length !== userNames.length) {
        setUserNames(validUserNames);
      }
    }
  }, [courseCodes, availableClasses, availableUserNames, classCodes, userNames]);

  useEffect(() => {
    if (classCodes.length) {
      const validUserNames = userNames.filter(name => availableUserNames.includes(name));
      if (validUserNames.length !== userNames.length) {
        setUserNames(validUserNames);
      }
    }
  }, [classCodes, availableUserNames, userNames]);

  // Existing image upload logic
  const handleImageUpload = useCallback((event: { target: { files: any[]; }; }) => {
    const file = event.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      setErrors((prev: any) => ({ ...prev, image: 'Only image files are allowed!' }));
      return;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      setErrors((prev: any) => ({ ...prev, image: 'Image must be smaller than 2MB!' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageFile({
        file: e.target?.result,
        fileName: file.name,
        previewUrl: e.target?.result
      });
      setErrors((prev: any) => ({ ...prev, image: undefined }));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDragOver = useCallback((e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: { preventDefault: () => void; dataTransfer: { files: Iterable<unknown> | ArrayLike<unknown>; }; }) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      const fakeEvent = { target: { files: [file] } };
      handleImageUpload(fakeEvent);
    }
  }, [handleImageUpload]);

  // Existing validation logic
  const validateForm = () => {
    const newErrors: any = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!body.trim()) {
      newErrors.body = 'Content is required';
    }
    
    if (recipientType === 'specific' && 
        !facultyCodes.length && 
        !courseCodes.length && 
        !classCodes.length && 
        !userNames.length) {
      newErrors.recipients = 'Please select at least one recipient criteria';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enhanced submit logic
  const handleSubmit = async () => {
    if (!validateForm()) return;

    // const payload = {
    //   title,
    //   body,
    //   image: imageFile?.file
    //     ? { base64String: imageFile.file, fileName: imageFile.fileName }
    //     : null,
    //   type,
    //   facultyCodes,
    //   courseCodes,
    //   classCodes,
    //   userNames,
    //   sendAll: recipientType === 'all',
    //   scheduledTime: scheduleEnabled ? scheduledTime : null,
    //   priority,
    //   deliveryChannels,
    //   requestId: requestId || `REQ_${Date.now()}`
    // };


    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setNotification({
        type: 'success',
        message: scheduleEnabled ? 'Notification scheduled successfully!' : 'Notification sent successfully!',
      });

      // Reset form
      setTitle('');
      setBody('');
      setImageFile(null);
      setRequestId('');
      setType('default');
      setRecipientType('all');
      setFacultyCodes([]);
      setCourseCodes([]);
      setClassCodes([]);
      setUserNames([]);
      setScheduleEnabled(false);
      setScheduledTime(null);
      setPriority('normal');
      setErrors({});
    } catch (error) {
      console.error(error);
      setNotification({
        type: 'error',
        message: 'An error occurred while sending notification.',
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handlePreview = () => {
    if (title || body || imageFile) {
      setIsPreviewVisible(true);
    } else {
      setNotification({
        type: 'info',
        message: 'Please enter title, content, or select an image to preview!'
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const currentNotificationType = notificationTypeOptions.find(t => t.value === type);

  // Template selection
  const notificationTemplates = [
    { id: 'welcome', title: 'Welcome Message', content: 'Welcome to our platform! We\'re excited to have you here.' },
    { id: 'reminder', title: 'Assignment Reminder', content: 'Don\'t forget about your upcoming assignment due date.' },
    { id: 'event', title: 'Event Announcement', content: 'Join us for an exciting event happening soon!' },
    { id: 'maintenance', title: 'Maintenance Notice', content: 'System maintenance will be performed during off-peak hours.' },
  ];

  const handleTemplateSelect = (template: { id: any; title: any; content: any; }) => {
    setTitle(template.title);
    setBody(template.content);
    setSelectedTemplate(template.id);
    setTemplateMode(false);
  };

  // Render Dashboard Tab
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <Statistic
              title={<span className="text-blue-100">Total Sent</span>}
              value={mockStats.totalSent}
              prefix={<SendOutlined className="text-white" />}
              valueStyle={{ color: 'white' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <Statistic
              title={<span className="text-green-100">Today's Sent</span>}
              value={mockStats.todaySent}
              prefix={<TrophyOutlined className="text-white" />}
              valueStyle={{ color: 'white' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <Statistic
              title={<span className="text-purple-100">Delivery Rate</span>}
              value={mockStats.deliveryRate}
              suffix="%"
              prefix={<CheckCircleOutlined className="text-white" />}
              valueStyle={{ color: 'white' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <Statistic
              title={<span className="text-orange-100">Read Rate</span>}
              value={mockStats.readRate}
              suffix="%"
              prefix={<EyeOutlined className="text-white" />}
              valueStyle={{ color: 'white' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Notifications */}
      <Card title="Recent Notifications" extra={<Button type="link">View All</Button>}>
        <List
          dataSource={mockRecentNotifications}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar 
                    icon={notificationTypeOptions.find(t => t.value === item.type)?.icon} 
                    className={`bg-gradient-to-r ${notificationTypeOptions.find(t => t.value === item.type)?.gradient}`}
                  />
                }
                title={<span className="font-semibold">{item.title}</span>}
                description={
                  <Space>
                    <Tag color={notificationTypeOptions.find(t => t.value === item.type)?.value}>
                      {notificationTypeOptions.find(t => t.value === item.type)?.label}
                    </Tag>
                    <Text type="secondary">{item.recipients} recipients</Text>
                    <Text type="secondary">•</Text>
                    <Text type="secondary">{item.time}</Text>
                  </Space>
                }
              />
              <Badge 
                status={item.status === 'sent' ? 'processing' : item.status === 'delivered' ? 'success' : 'default'} 
                text={item.status} 
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );

  // Render Compose Tab
  const renderCompose = () => (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <Row gutter={16} align="middle">
          <Col>
            <BulbOutlined className="text-2xl text-indigo-600" />
          </Col>
          <Col flex={1}>
            <Title level={5} className="mb-1">Quick Start</Title>
            <Text type="secondary">Use templates or start from scratch</Text>
          </Col>
          <Col>
            <Space>
              <Button 
                icon={<FileTextOutlined />} 
                onClick={() => setTemplateMode(true)}
                className="border-indigo-300 text-indigo-600 hover:bg-indigo-50"
              >
                Use Template
              </Button>
              <Button 
                type="primary" 
                icon={<StarOutlined />}
                className="bg-indigo-600 border-indigo-600"
              >
                Start Fresh
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={24}>
        {/* Left Column - Content */}
        <Col xs={24} lg={14}>
          <Card title="Notification Content" className="shadow-sm">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MessageOutlined className="mr-2" />
                  Title *
                </label>
                <Input
                  placeholder="Enter notification title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  status={errors.title ? 'error' : ''}
                  disabled={isLoading}
                  className="rounded-lg"
                  size="large"
                />
                {errors.title && (
                  <Text type="danger" className="text-xs mt-1">{errors.title}</Text>
                )}
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FileTextOutlined className="mr-2" />
                  Content *
                </label>
                <TextArea
                  placeholder="Enter notification content"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={4}
                  status={errors.body ? 'error' : ''}
                  disabled={isLoading}
                  className="rounded-lg"
                  showCount
                  maxLength={500}
                />
                {errors.body && (
                  <Text type="danger" className="text-xs mt-1">{errors.body}</Text>
                )}
              </div>

              {/* Advanced Options */}
              <Collapse>
                <Panel header="Advanced Options" key="1">
                  <div className="space-y-4">
                    {/* Request ID */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Request ID (Optional)
                      </label>
                      <Input
                        placeholder="Auto-generated if empty"
                        value={requestId}
                        onChange={(e) => setRequestId(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <Radio.Group value={priority} onChange={(e) => setPriority(e.target.value)}>
                        <Radio value="low">Low</Radio>
                        <Radio value="normal">Normal</Radio>
                        <Radio value="high">High</Radio>
                        <Radio value="urgent">Urgent</Radio>
                      </Radio.Group>
                    </div>

                    {/* Delivery Channels */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Channels
                      </label>
                      <Select
                        mode="multiple"
                        value={deliveryChannels}
                        onChange={setDeliveryChannels}
                        className="w-full"
                        options={[
                          { label: 'Push Notification', value: 'push', icon: <MobileOutlined /> },
                          { label: 'Email', value: 'email', icon: <MailOutlined /> },
                          { label: 'SMS', value: 'sms', icon: <MessageOutlined /> },
                          { label: 'In-App', value: 'inapp', icon: <DesktopOutlined /> },
                        ]}
                      />
                    </div>

                    {/* Schedule */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">
                          Schedule Notification
                        </label>
                        <Switch 
                          checked={scheduleEnabled} 
                          onChange={setScheduleEnabled}
                          checkedChildren="ON"
                          unCheckedChildren="OFF"
                        />
                      </div>
                      {scheduleEnabled && (
                        <DatePicker
                          showTime
                          value={scheduledTime}
                          onChange={setScheduledTime}
                          className="w-full"
                          placeholder="Select date and time"
                        />
                      )}
                    </div>
                  </div>
                </Panel>
              </Collapse>
            </div>
          </Card>
        </Col>

        {/* Right Column - Settings */}
        <Col xs={24} lg={10}>
          <div className="space-y-6">
            {/* Notification Type */}
            <Card title="Notification Type" className="shadow-sm">
              <div className="grid grid-cols-2 gap-3">
                {notificationTypeOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                      type === option.value 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setType(option.value)}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-full bg-gradient-to-r ${option.gradient}`}>
                        <span className="text-white text-sm">{option.icon}</span>
                      </div>
                      <div>
                        <div className="font-medium text-sm">{option.label}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Image Upload */}
            <Card title="Media Attachment" className="shadow-sm">
              {imageFile ? (
                <div className="relative">
                  <img
                    src={imageFile.previewUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                  />
                  <Button
                    icon={<CloseOutlined />}
                    shape="circle"
                    onClick={() => setImageFile(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white border-none hover:bg-red-600"
                    size="small"
                  />
                </div>
              ) : (
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                    isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <UploadOutlined className="text-3xl text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-2">Drag & drop an image here</p>
                  <Upload
                    accept="image/*"
                    showUploadList={false}
                    customRequest={({ file }) => {
                      const fakeEvent = { target: { files: [file] } };
                      handleImageUpload(fakeEvent);
                    }}
                    disabled={isLoading}
                  >
                    <Button
                      icon={<UploadOutlined />}
                      className="bg-blue-500 text-white border-none hover:bg-blue-600"
                    >
                      Choose File
                    </Button>
                  </Upload>
                  <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 2MB</p>
                </div>
              )}
              {errors.image && (
                <Text type="danger" className="text-xs mt-1">{errors.image}</Text>
              )}
            </Card>

            {/* Preview Card */}
            <Card title="Quick Preview" className="shadow-sm">
              <div className="space-y-3">
                <Button
                  icon={<EyeOutlined />}
                  onClick={handlePreview}
                  disabled={isLoading || (!title && !body && !imageFile)}
                  className="w-full"
                  size="large"
                >
                  Preview Notification
                </Button>
                
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    size="small" 
                    className={previewDevice === 'mobile' ? 'bg-blue-50 border-blue-300' : ''}
                    onClick={() => setPreviewDevice('mobile')}
                    icon={<MobileOutlined />}
                  >
                    Mobile
                  </Button>
                  <Button 
                    size="small" 
                    className={previewDevice === 'desktop' ? 'bg-blue-50 border-blue-300' : ''}
                    onClick={() => setPreviewDevice('desktop')}
                    icon={<DesktopOutlined />}
                  >
                    Desktop
                  </Button>
                  <Button 
                    size="small" 
                    className={previewDevice === 'email' ? 'bg-blue-50 border-blue-300' : ''}
                    onClick={() => setPreviewDevice('email')}
                    icon={<MailOutlined />}
                  >
                    Email
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </Col>
      </Row>

      {/* Recipients Section */}
      <Card title="Target Recipients" className="shadow-sm">
        <div className="space-y-6">
          {/* Recipient Type Selection */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <Radio.Group
              value={recipientType}
              onChange={(e) => setRecipientType(e.target.value)}
              disabled={isLoading}
              className="w-full"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    recipientType === 'all' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  <Radio value="all" className="mb-2">
                    <span className="font-semibold">Broadcast to All</span>
                  </Radio>
                  <div className="ml-6">
                    <GlobalOutlined className="mr-2 text-blue-500" />
                    <Text type="secondary">Send to entire school ({users.length} users)</Text>
                  </div>
                </div>
                
                <div 
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    recipientType === 'specific' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  <Radio value="specific" className="mb-2">
                    <span className="font-semibold">Target Specific Groups</span>
                  </Radio>
                  <div className="ml-6">
                    <TeamOutlined className="mr-2 text-green-500" />
                    <Text type="secondary">Filter by faculty, course, class, or users</Text>
                  </div>
                </div>
              </div>
            </Radio.Group>
          </div>

          {/* Specific Recipients Filters */}
          {recipientType === 'specific' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <FilterOutlined className="text-blue-500" />
                <Title level={5} className="m-0">Filter Recipients</Title>
              </div>
              
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">
                      <BookOutlined className="mr-1" />
                      Faculties
                    </label>
                    <Select
                      mode="multiple"
                      placeholder="Select faculties"
                      value={facultyCodes}
                      onChange={setFacultyCodes}
                      options={faculties.map(f => ({ label: f, value: f }))}
                      disabled={isLoading}
                      className="w-full"
                      showSearch
                      filterOption={(input, option: any) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </div>
                </Col>
                
                <Col xs={24} sm={12} lg={6}>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">
                      <CrownOutlined className="mr-1" />
                      Courses
                    </label>
                    <Select
                      mode="multiple"
                      placeholder="Select courses"
                      value={courseCodes}
                      onChange={setCourseCodes}
                      options={availableCourses.map(c => ({ label: c, value: c }))}
                      disabled={isLoading || !availableCourses.length}
                      className="w-full"
                      showSearch
                      filterOption={(input, option: any) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </div>
                </Col>
                
                <Col xs={24} sm={12} lg={6}>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">
                      <UsergroupAddOutlined className="mr-1" />
                      Classes
                    </label>
                    <Select
                      mode="multiple"
                      placeholder="Select classes"
                      value={classCodes}
                      onChange={setClassCodes}
                      options={availableClasses.map(c => ({ label: c, value: c }))}
                      disabled={isLoading || !availableClasses.length}
                      className="w-full"
                      showSearch
                      filterOption={(input, option: any) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </div>
                </Col>
                
                <Col xs={24} sm={12} lg={6}>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">
                      <UserOutlined className="mr-1" />
                      Individual Users
                    </label>
                    <Select
                      mode="multiple"
                      placeholder="Select users"
                      value={userNames}
                      onChange={setUserNames}
                      options={availableUserNames.map(u => ({ label: u, value: u }))}
                      disabled={isLoading || !availableUserNames.length}
                      className="w-full"
                      showSearch
                      filterOption={(input, option: any) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </div>
                </Col>
              </Row>

              {errors.recipients && (
                <Alert
                  message={errors.recipients}
                  type="error"
                  showIcon
                  className="mt-4"
                />
              )}

              {/* Recipients Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <Row align="middle" gutter={16}>
                  <Col>
                    <div className="bg-blue-500 p-3 rounded-full">
                      <UsergroupAddOutlined className="text-white text-lg" />
                    </div>
                  </Col>
                  <Col flex={1}>
                    <div>
                      <Title level={4} className="mb-1 text-blue-700">
                        {filteredUsers.length} Recipients Selected
                      </Title>
                      <Text type="secondary">
                        {filteredUsers.length === 0 
                          ? 'No users match the selected criteria' 
                          : `Notification will be sent to ${filteredUsers.length} users`
                        }
                      </Text>
                    </div>
                  </Col>
                  <Col>
                    <Progress
                      type="circle"
                      size={60}
                      percent={Math.round((filteredUsers.length / users.length) * 100)}
                      format={() => `${Math.round((filteredUsers.length / users.length) * 100)}%`}
                      strokeColor={{
                        '0%': '#108ee9',
                        '100%': '#87d068',
                      }}
                    />
                  </Col>
                </Row>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Action Buttons */}
      <Card className="shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              icon={<HistoryOutlined />}
              onClick={() => setActiveTab('history')}
              className="border-gray-300 hover:bg-gray-50"
            >
              View History
            </Button>
            <Button
              icon={<FileTextOutlined />}
              onClick={() => setTemplateMode(true)}
              className="border-gray-300 hover:bg-gray-50"
            >
              Save as Template
            </Button>
          </div>
          
          <div className="flex space-x-3">
            <Button
              icon={<EyeOutlined />}
              onClick={handlePreview}
              disabled={isLoading || (!title && !body && !imageFile)}
              size="large"
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              Preview
            </Button>
            <Button
              type="primary"
              icon={scheduleEnabled ? <ScheduleOutlined /> : <SendOutlined />}
              onClick={handleSubmit}
              disabled={isLoading || filteredUsers.length === 0}
              loading={isLoading}
              size="large"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 border-none hover:from-blue-700 hover:to-indigo-700 px-8"
            >
              {scheduleEnabled ? 'Schedule Notification' : 'Send Notification'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  // Render History Tab
  const renderHistory = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card>
        <Row gutter={16} align="middle">
          <Col flex={1}>
            <Input
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<SearchOutlined />}
              size="large"
            />
          </Col>
          <Col>
            <Select
              value={filterType}
              onChange={setFilterType}
              size="large"
              className="w-32"
              options={[
                { label: 'All', value: 'all' },
                ...notificationTypeOptions.map(type => ({ label: type.label, value: type.value }))
              ]}
            />
          </Col>
        </Row>
      </Card>

      {/* History Timeline */}
      <Card title="Notification History">
        <Timeline>
          {mockRecentNotifications.map((item) => (
            <Timeline.Item
              key={item.id}
              dot={
                <Avatar 
                  size="small" 
                  icon={notificationTypeOptions.find(t => t.value === item.type)?.icon}
                  className={`bg-gradient-to-r ${notificationTypeOptions.find(t => t.value === item.type)?.gradient}`}
                />
              }
            >
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <Title level={5} className="mb-1">{item.title}</Title>
                  <Badge 
                    status={item.status === 'sent' ? 'processing' : item.status === 'delivered' ? 'success' : 'default'} 
                    text={item.status.toUpperCase()} 
                  />
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>
                    <Tag color={notificationTypeOptions.find(t => t.value === item.type)?.value}>
                      {notificationTypeOptions.find(t => t.value === item.type)?.label}
                    </Tag>
                  </span>
                  <span><UsergroupAddOutlined className="mr-1" />{item.recipients} recipients</span>
                  <span><ClockCircleOutlined className="mr-1" />{item.time}</span>
                </div>
                <div className="mt-3 flex space-x-2">
                  <Button size="small" type="link">View Details</Button>
                  <Button size="small" type="link">Duplicate</Button>
                  <Button size="small" type="link" danger>Delete</Button>
                </div>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>
    </div>
  );

  // Render Analytics Tab
  const renderAnalytics = () => (
    <div className="space-y-6">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Delivery Performance" className="h-80">
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <PieChartOutlined className="text-6xl text-blue-400 mb-4" />
                <Text type="secondary">Analytics chart would go here</Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Engagement Metrics" className="h-80">
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <FireOutlined className="text-6xl text-orange-400 mb-4" />
                <Text type="secondary">Engagement chart would go here</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      
      <Card title="Notification Types Distribution">
        <Row gutter={[16, 16]}>
          {notificationTypeOptions.map((type) => (
            <Col xs={12} sm={8} md={6} key={type.value}>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className={`mx-auto mb-2 w-12 h-12 rounded-full bg-gradient-to-r ${type.gradient} flex items-center justify-center`}>
                  <span className="text-white">{type.icon}</span>
                </div>
                <div className="font-semibold">{Math.floor(Math.random() * 100)}</div>
                <div className="text-xs text-gray-500">{type.label}</div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );

  // Render Settings Tab
  const renderSettings = () => (
    <div className="space-y-6">
      <Card title="General Settings">
        <div className="space-y-6">
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <Text strong>Auto-save drafts</Text>
                    <br />
                    <Text type="secondary" className="text-sm">Automatically save notification drafts</Text>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <Text strong>Email notifications</Text>
                    <br />
                    <Text type="secondary" className="text-sm">Receive email confirmations</Text>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <Text strong>Push notifications</Text>
                    <br />
                    <Text type="secondary" className="text-sm">Browser push notifications</Text>
                  </div>
                  <Switch />
                </div>
              </div>
            </Col>
            
            <Col xs={24} md={12}>
              <div className="space-y-4">
                <div>
                  <Text strong className="block mb-2">Default notification type</Text>
                  <Select
                    defaultValue="default"
                    className="w-full"
                    options={notificationTypeOptions.map(type => ({
                      label: type.label,
                      value: type.value
                    }))}
                  />
                </div>
                
                <div>
                  <Text strong className="block mb-2">Time zone</Text>
                  <Select
                    defaultValue="UTC+7"
                    className="w-full"
                    options={[
                      { label: 'UTC+7 (Vietnam)', value: 'UTC+7' },
                      { label: 'UTC+0 (GMT)', value: 'UTC+0' },
                      { label: 'UTC+8 (Singapore)', value: 'UTC+8' },
                    ]}
                  />
                </div>
                
                <div>
                  <Text strong className="block mb-2">Language</Text>
                  <Select
                    defaultValue="vi"
                    className="w-full"
                    options={[
                      { label: 'Tiếng Việt', value: 'vi' },
                      { label: 'English', value: 'en' },
                      { label: '中文', value: 'zh' },
                    ]}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Card>
      
      <Card title="Notification Templates">
        <Row gutter={[16, 16]}>
          {notificationTemplates.map((template) => (
            <Col xs={24} sm={12} lg={8} key={template.id}>
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
                <Title level={5}>{template.title}</Title>
                <Text type="secondary" className="text-sm block mb-3">
                  {template.content.substring(0, 60)}...
                </Text>
                <div className="flex space-x-2">
                  <Button size="small" type="primary" ghost>Use Template</Button>
                  <Button size="small">Edit</Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Notification Alert */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <Alert
            message={notification.message}
            type={notification.type}
            showIcon
            icon={
              notification.type === 'success' ? <CheckCircleOutlined /> :
              notification.type === 'error' ? <ExclamationCircleOutlined /> :
              <InfoCircleOutlined />
            }
            className="max-w-sm shadow-lg border-0"
            closable
            onClose={() => setNotification(null)}
          />
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
                <BellOutlined className="text-white text-xl" />
              </div>
              <div>
                <Title level={2} className="mb-0 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Notification Management System
                </Title>
                <Text type="secondary">Advanced notification center for educational institutions</Text>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge count={5} className="cursor-pointer">
                <Avatar icon={<BellOutlined />} className="bg-blue-100 text-blue-600" />
              </Badge>
              <Avatar icon={<UserOutlined />} className="bg-gradient-to-r from-purple-500 to-pink-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          size="large"
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <TabPane
            tab={
              <span className="flex items-center space-x-2">
                <DashboardOutlined />
                <span>Dashboard</span>
              </span>
            }
            key="dashboard"
          >
            {renderDashboard()}
          </TabPane>
          
          <TabPane
            tab={
              <span className="flex items-center space-x-2">
                <SendOutlined />
                <span>Compose</span>
              </span>
            }
            key="compose"
          >
            {renderCompose()}
          </TabPane>
          
          <TabPane
            tab={
              <span className="flex items-center space-x-2">
                <HistoryOutlined />
                <span>History</span>
              </span>
            }
            key="history"
          >
            {renderHistory()}
          </TabPane>
          
          <TabPane
            tab={
              <span className="flex items-center space-x-2">
                <PieChartOutlined />
                <span>Analytics</span>
              </span>
            }
            key="analytics"
          >
            {renderAnalytics()}
          </TabPane>
          
          <TabPane
            tab={
              <span className="flex items-center space-x-2">
                <SettingOutlined />
                <span>Settings</span>
              </span>
            }
            key="settings"
          >
            {renderSettings()}
          </TabPane>
        </Tabs>
      </div>

      {/* Enhanced Preview Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <EyeOutlined />
            <span>Notification Preview</span>
            <Tag color="blue">{previewDevice}</Tag>
          </div>
        }
        open={isPreviewVisible}
        onCancel={() => setIsPreviewVisible(false)}
        footer={null}
        width={previewDevice === 'desktop' ? 600 : 400}
        className="preview-modal"
      >
        <div className={`${previewDevice === 'mobile' ? 'max-w-sm' : previewDevice === 'email' ? 'max-w-lg' : 'max-w-md'} mx-auto`}>
          <div className={`p-4 rounded-lg border-l-4 ${currentNotificationType?.bgColor} border-l-${currentNotificationType?.color.split('-')[1]}-500 shadow-sm`}>
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-full bg-gradient-to-r ${currentNotificationType?.gradient} flex-shrink-0`}>
                <span className="text-white text-sm">{currentNotificationType?.icon}</span>
              </div>
              <div className="flex-1">
                {title && (
                  <Title level={5} className={`mb-2 ${currentNotificationType?.color}`}>
                    {title}
                  </Title>
                )}
                {body && (
                  <Text className="text-gray-700 block mb-3">{body}</Text>
                )}
                {imageFile && (
                  <img
                    src={imageFile.previewUrl}
                    alt="Preview"
                    className="w-full rounded-lg mb-3"
                  />
                )}
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <Tag color={currentNotificationType?.value} className="border-0">
                    {currentNotificationType?.label}
                  </Tag>
                  <Text type="secondary" className="text-xs">
                    <ClockCircleOutlined className="mr-1" />
                    Just now
                  </Text>
                </div>
              </div>
            </div>
          </div>
          
          {previewDevice === 'email' && (
            <div className="mt-4 text-center">
              <Button type="primary" className="mr-2">View in App</Button>
              <Button>Unsubscribe</Button>
            </div>
          )}
        </div>
      </Modal>

      {/* Template Selection Modal */}
      <Modal
        title="Choose Template"
        open={templateMode}
        onCancel={() => setTemplateMode(false)}
        footer={null}
        width={800}
      >
        <Row gutter={[16, 16]}>
          {notificationTemplates.map((template) => (
            <Col xs={24} sm={12} key={template.id}>
              <div 
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer hover:border-blue-300"
                onClick={() => handleTemplateSelect(template)}
              >
                <Title level={5}>{template.title}</Title>
                <Text type="secondary" className="block mb-3">
                  {template.content}
                </Text>
                <Button type="primary" ghost size="small" className="w-full">
                  Use This Template
                </Button>
              </div>
            </Col>
          ))}
        </Row>
      </Modal>
    </div>
  );
};

export default NotificationSender;