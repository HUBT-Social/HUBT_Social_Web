import {
  BulbOutlined,
  CloseOutlined,
  DesktopOutlined,
  FileTextOutlined as DocumentOutlined,
  EyeOutlined,
  FileTextOutlined,
  HistoryOutlined,
  MailOutlined,
  MessageOutlined,
  MobileOutlined,
  ScheduleOutlined,
  SendOutlined,
  MessageOutlined as SmsOutlined,
  StarOutlined,
  UploadOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import { Button, Card, Col, Collapse, DatePicker, Input, Radio, Row, Select, Space, Switch, Tag, Tooltip, Typography, Upload } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { ChangeEvent, DragEvent, FC, useState } from 'react';
import { useNotificationContext } from '../../contexts/NotificationContext';
import { notificationTypeOptions } from '../../data/mockData';
import RecipientSelector from './RecipientSelector';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Panel } = Collapse;


const ComposeTab: FC = () => {
  const { 
    title, setTitle,
    body, setBody,
    imageFile, setImageFile,
    type, setType,
    requestId, setRequestId,
    scheduleEnabled, setScheduleEnabled,
    scheduledTime, setScheduledTime,
    priority, setPriority,
    deliveryChannels, setDeliveryChannels,
    recipientType,
    facultyCodes,
    courseCodes,
    classCodes,
    userNames,
    errors, setErrors,
    isLoading, setIsLoading,
    setNotification,
    setIsPreviewVisible,
    setTemplateMode,
    setActiveTab
  } = useNotificationContext();

  // State for drag and drop
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Handle image upload
  const handleImageUpload = (event: { target: { files: any } }) => {
    const file = event.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      setErrors((prev) => ({ ...prev, image: 'Only image files are allowed!' }));
      return;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      setErrors((prev) => ({ ...prev, image: 'Image must be smaller than 2MB!' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageFile({
        file: e.target?.result as string,
        fileName: file.name,
        previewUrl: e.target?.result as string
      });
      setErrors((prev: any) => ({ ...prev, image: undefined }));
    };
    reader.readAsDataURL(file);
  };

  // Handle drag and drop events
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      const fakeEvent = { target: { files: [file] } };
      handleImageUpload(fakeEvent);
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!body.trim()) {
      newErrors.body = 'Content is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  // Submit handler
const handleSubmit = async () => {
  if (!validateForm()) return;

  setIsLoading(true);

  // Tạo payload để submit
  const payload = {
    title: title.trim(),
    body: body.trim(),
    type: type,
    requestId: requestId || `REQ_${Date.now()}`, // Auto-generate nếu trống
    priority: priority,
    deliveryChannels: deliveryChannels.length > 0 ? deliveryChannels : ['push'], // Default push nếu không chọn
    scheduleEnabled: scheduleEnabled,
    scheduledTime: scheduleEnabled && scheduledTime ? scheduledTime.toISOString() : null,
    imageFile: imageFile ? {
      fileName: imageFile.fileName,
      fileData: imageFile.file
    } : null,
    facultyCodes: userNames.length == 0 ? facultyCodes : [],
    courseCodes: userNames.length == 0 ? courseCodes : [],
    classCodes: userNames.length == 0 ? classCodes : [],
    userNames: userNames,
    sendAll: recipientType === 'all',
    timestamp: new Date().toISOString(),
    createdBy: 'admin', // Thay bằng user thực tế
  };
  /*
    facultyCodes,
      courseCodes,
      classCodes,
      userNames,
      sendAll: recipientType === 'all',
  */

  // Console log payload
  console.log('=== NOTIFICATION PAYLOAD ===');
  console.log(JSON.stringify(payload, null, 2));
  console.log('=== END PAYLOAD ===');

  try {
    // Simulate API call
    console.log('Sending notification...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('✅ Notification sent successfully!');
    
    setNotification({
      id: Date.now(),
      title: payload.title,
      body: payload.body,
      type: payload.type,
      recipients: 111, // Mock recipients count
      time: new Date().toLocaleString(),
      status: 'sent',
    });

    // Reset form
    setTitle('');
    setBody('');
    setImageFile(null);
    setRequestId('');
    setType('default');
    setScheduleEnabled(false);
    setScheduledTime(null);
    setPriority('normal');
    setDeliveryChannels(['push']);
    setErrors({});
    
    console.log('Form reset completed');
  } catch (error) {
    console.error('❌ Failed to send notification:', error);
    
    setNotification({
      id: Date.now(),
      title: payload.title,
      body: payload.body,
      type: payload.type,
      recipients: 0,
      time: new Date().toLocaleString(),
      status: 'failed',
    });
  } finally {
    setIsLoading(false);
    console.log('Submit process completed');
  }
};


  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 hover:shadow-md transition-all">
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
                className="bg-indigo-600 border-indigo-600 hover:bg-indigo-700"
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
          <Card 
            title={
              <div className="flex items-center space-x-2">
                <DocumentOutlined />
                <span>Notification Content</span>
              </div>
            } 
            className="shadow-sm hover:shadow-md transition-all"
          >
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
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                  status={errors.title ? 'error' : undefined}
                  disabled={isLoading}
                  className="rounded-lg"
                  size="large"
                  maxLength={100}
                  showCount
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
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setBody(e.target.value)}
                  rows={4}
                  status={errors.body ? 'error' : undefined}
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
              <Collapse className="bg-gray-50 border-gray-200">
                <Panel 
                  header={
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">Advanced Options</span>
                      {(requestId || priority !== 'normal' || deliveryChannels.length > 1 || scheduleEnabled) && (
                        <Tag color="blue">Configured</Tag>
                      )}
                    </div>
                  } 
                  key="1"
                >
                  <div className="space-y-4">
                    {/* Request ID */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Request ID (Optional)
                      </label>
                      <Input
                        placeholder="Auto-generated if empty"
                        value={requestId}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setRequestId(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <Radio.Group 
                        value={priority} 
                        onChange={(e) => setPriority(e.target.value)}
                        buttonStyle="solid"
                        className="w-full"
                      >
                        <Radio.Button value="low" className="w-1/4 text-center">Low</Radio.Button>
                        <Radio.Button value="normal" className="w-1/4 text-center">Normal</Radio.Button>
                        <Radio.Button value="high" className="w-1/4 text-center">High</Radio.Button>
                        <Radio.Button value="urgent" className="w-1/4 text-center">Urgent</Radio.Button>
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
                          { label: 'SMS', value: 'sms', icon: <SmsOutlined /> },
                          { label: 'In-App', value: 'inapp', icon: <DesktopOutlined /> }
                        ]}
                        optionRender={(option) => (
                          <Space>
                            {option.data.icon}
                            {option.data.label}
                          </Space>
                        )}
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
                          onChange={(date: Dayjs | null) => setScheduledTime(date)}
                          className="w-full"
                          placeholder="Select date and time"
                          disabledDate={(current: Dayjs) => current && current.isBefore(dayjs(), 'day')}
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
            <Card 
              title={
                <div className="flex items-center space-x-2">
                  <MessageOutlined />
                  <span>Notification Type</span>
                </div>
              } 
              className="shadow-sm hover:shadow-md transition-all"
            >
              <div className="grid grid-cols-2 gap-3">
                {notificationTypeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
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
                          <Icon style={{ fontSize: '16px', color: '#fff' }} />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{option.label}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Image Upload */}
            <Card 
              title={
                <div className="flex items-center space-x-2">
                  <UploadOutlined />
                  <span>Media Attachment</span>
                </div>
              } 
              className="shadow-sm hover:shadow-md transition-all"
            >
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
              {errors.image && (
                <Text type="danger" className="text-xs mt-1">{errors.image}</Text>
              )}
            </Card>

            {/* Preview Card */}
            <Card 
              title={
                <div className="flex items-center space-x-2">
                  <EyeOutlined />
                  <span>Quick Preview</span>
                </div>
              } 
              className="shadow-sm hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <Tooltip title={!title && !body && !imageFile ? "Add content first" : ""}>
                  <Button
                    icon={<EyeOutlined />}
                    onClick={() => setIsPreviewVisible(true)}
                    disabled={isLoading || (!title && !body && !imageFile)}
                    className="w-full"
                    size="large"
                  >
                    Preview Notification
                  </Button>
                </Tooltip>
                
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    size="small" 
                    className="bg-blue-50 border-blue-300"
                    icon={<MobileOutlined />}
                  >
                    Mobile
                  </Button>
                  <Button 
                    size="small" 
                    className="border-gray-300"
                    icon={<DesktopOutlined />}
                  >
                    Desktop
                  </Button>
                  <Button 
                    size="small" 
                    className="border-gray-300"
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
      <Card 
        title={
          <div className="flex items-center space-x-2">
            <UsergroupAddOutlined />
            <span>Target Recipients</span>
          </div>
        } 
        className="shadow-sm hover:shadow-md transition-all"
      >
        <RecipientSelector />
      </Card>

      {/* Action Buttons */}
      <Card className="shadow-sm hover:shadow-md transition-all">
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
              onClick={() => setIsPreviewVisible(true)}
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
              disabled={isLoading || !title || !body}
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
};

export default ComposeTab;