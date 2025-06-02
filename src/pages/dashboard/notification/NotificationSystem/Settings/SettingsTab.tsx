import { BellOutlined, ClockCircleOutlined, FileTextOutlined, GlobalOutlined, LockOutlined, SaveOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Divider, Input, Row, Select, Space, Switch, Tag, Typography } from 'antd';
import { mockTemplates } from '../../data/mockData';


const { Title, Text } = Typography;

const SettingsTab = () => {
  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card 
        title={
          <div className="flex items-center space-x-2">
            <BellOutlined />
            <span>General Settings</span>
          </div>
        }
        className="shadow-sm hover:shadow-md transition-all"
      >
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
                    options={[
                      { label: 'Default', value: 'default' },
                      { label: 'Event', value: 'event' },
                      { label: 'Warning', value: 'warning' },
                      { label: 'Announcement', value: 'announcement' },
                      { label: 'Reminder', value: 'reminder' },
                      { label: 'Urgent', value: 'urgent' },
                      { label: 'Success', value: 'success' },
                      { label: 'Information', value: 'info' },
                    ]}
                  />
                </div>
                
                <div>
                  <Text strong className="block mb-2">
                    <ClockCircleOutlined className="mr-1" />
                    Time zone
                  </Text>
                  <Select
                    defaultValue="UTC+7"
                    className="w-full"
                    options={[
                      { label: 'UTC+7 (Vietnam)', value: 'UTC+7' },
                      { label: 'UTC+0 (GMT)', value: 'UTC+0' },
                      { label: 'UTC+8 (Singapore)', value: 'UTC+8' },
                      { label: 'UTC-5 (Eastern Time)', value: 'UTC-5' },
                      { label: 'UTC-8 (Pacific Time)', value: 'UTC-8' },
                    ]}
                  />
                </div>
                
                <div>
                  <Text strong className="block mb-2">
                    <GlobalOutlined className="mr-1" />
                    Language
                  </Text>
                  <Select
                    defaultValue="en"
                    className="w-full"
                    options={[
                      { label: 'English', value: 'en' },
                      { label: 'Tiếng Việt', value: 'vi' },
                      { label: '中文', value: 'zh' },
                      { label: 'Español', value: 'es' },
                      { label: 'Français', value: 'fr' },
                    ]}
                  />
                </div>
              </div>
            </Col>
          </Row>
          
          <Divider />
          
          <div className="flex justify-end">
            <Button type="primary" icon={<SaveOutlined />}>
              Save Settings
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Notification Templates */}
      <Card 
        title={
          <div className="flex items-center space-x-2">
            <FileTextOutlined />
            <span>Notification Templates</span>
          </div>
        }
        className="shadow-sm hover:shadow-md transition-all"
        extra={<Button type="primary">Create New Template</Button>}
      >
        <Row gutter={[16, 16]}>
          {mockTemplates.map((template) => (
            <Col xs={24} sm={12} lg={8} key={template.id}>
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <Title level={5} className="mb-0">{template.title}</Title>
                  <Tag color={template.type}>{template.type.charAt(0).toUpperCase() + template.type.slice(1)}</Tag>
                </div>
                <Text type="secondary" className="text-sm block mb-3 line-clamp-2">
                  {template.content}
                </Text>
                <div className="flex space-x-2 mt-4">
                  <Button size="small" type="primary" ghost>Use Template</Button>
                  <Button size="small">Edit</Button>
                  <Button size="small" type="primary" danger ghost>Delete</Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
      
      {/* Account Settings */}
      <Card 
        title={
          <div className="flex items-center space-x-2">
            <UserOutlined />
            <span>Account Settings</span>
          </div>
        }
        className="shadow-sm hover:shadow-md transition-all"
      >
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={8}>
            <div className="flex flex-col items-center">
              <Avatar size={80} icon={<UserOutlined />} className="bg-gradient-to-r from-purple-500 to-pink-500 mb-3" />
              <Title level={4} className="mb-1">Admin User</Title>
              <Text type="secondary">System Administrator</Text>
              <Button className="mt-3">Change Avatar</Button>
            </div>
          </Col>
          
          <Col xs={24} md={16}>
            <div className="space-y-4">
              <div>
                <Text strong className="block mb-1">Email Address</Text>
                <Input 
                  defaultValue="admin@school.edu" 
                  prefix={<UserOutlined className="text-gray-400" />} 
                />
              </div>
              
              <div>
                <Text strong className="block mb-1">Name</Text>
                <Input defaultValue="System Administrator" />
              </div>
              
              <div>
                <Text strong className="block mb-1">
                  <LockOutlined className="mr-1" />
                  Change Password
                </Text>
                <Space direction="vertical" className="w-full">
                  <Input.Password placeholder="Current password" />
                  <Input.Password placeholder="New password" />
                  <Input.Password placeholder="Confirm new password" />
                </Space>
              </div>
              
              <div className="flex justify-end">
                <Button type="primary" icon={<SaveOutlined />}>
                  Save Changes
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
      
      {/* API Access */}
      <Card 
        title={
          <div className="flex items-center space-x-2">
            <LockOutlined />
            <span>API Access</span>
          </div>
        }
        className="shadow-sm hover:shadow-md transition-all"
      >
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <Title level={5}>API Key</Title>
            <div className="flex items-center space-x-2 mb-2">
              <Input.Password 
                value="sk_test_51LxTRQDJ9QAQBhqcLAu2jxsS" 
                readOnly 
                className="font-mono"
              />
              <Button>Copy</Button>
              <Button danger>Regenerate</Button>
            </div>
            <Text type="secondary" className="text-sm">
              This key grants access to our notification API. Keep it secure.
            </Text>
          </div>
          
          <div>
            <Title level={5}>API Documentation</Title>
            <Text className="block mb-3">
              Refer to our API documentation to integrate notifications into your applications.
            </Text>
            <Button type="primary">View Documentation</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsTab;