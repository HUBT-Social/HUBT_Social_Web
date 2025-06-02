import { BellOutlined, ClockCircleOutlined, DesktopOutlined, EyeOutlined, MailOutlined, MobileOutlined, MoreOutlined } from '@ant-design/icons';
import { Avatar, Button, Modal, Radio, Tag, Typography } from 'antd';
import { useNotificationContext } from '../contexts/NotificationContext';
import { notificationTypeOptions } from '../data/mockData';

const { Text } = Typography;

const NotificationPreview = () => {
  const { 
    isPreviewVisible, 
    setIsPreviewVisible,
    previewDevice,
    setPreviewDevice,
    title,
    body,
    imageFile,
    type
  } = useNotificationContext();

  const currentNotificationType = notificationTypeOptions.find(t => t.value === type) || notificationTypeOptions[0];
  

  // Facebook-style Mobile Notification
  const MobileNotification = () => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Mobile Status Bar */}
      <div className="bg-black text-white text-xs px-4 py-1 flex justify-between items-center">
        <span className="font-medium">9:41</span>
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
          <span>📶</span>
          <span>🔋</span>
        </div>
      </div>
      
      {/* Notification */}
      <div className="bg-white p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <div className="flex items-start space-x-3">
          <div className="relative">
            <Avatar 
              size={40} 
              style={{ backgroundColor: '#1877f2' }}
              icon={<BellOutlined />}
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Text strong className="text-gray-900 text-sm block mb-1">
                  {title || 'Your App'}
                </Text>
                <Text className="text-gray-600 text-sm leading-relaxed">
                  {body || 'You have a new notification'}
                </Text>
              </div>
              <div className="flex items-center space-x-2 ml-2">
                <Text type="secondary" className="text-xs whitespace-nowrap">
                  2m
                </Text>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
            </div>
            {imageFile?.previewUrl && (
              <div className="mt-2 rounded-lg overflow-hidden">
                <img
                  src={imageFile.previewUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Facebook-style Desktop Notification
  const DesktopNotification = () => (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden max-w-sm">
      {/* Desktop notification header */}
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar 
            size={24} 
            style={{ backgroundColor: '#1877f2' }}
            icon={<BellOutlined className="text-xs" />}
          />
          <Text strong className="text-sm text-gray-900">
            Your App
          </Text>
        </div>
        <MoreOutlined className="text-gray-400 hover:text-gray-600 cursor-pointer" />
      </div>
      
      {/* Notification content */}
      <div className="p-4">
        <div className="mb-3">
          <Text strong className="text-gray-900 text-base block mb-2">
            {title || 'New Notification'}
          </Text>
          <Text className="text-gray-600 text-sm leading-relaxed">
            {body || 'You have received a new notification from the app.'}
          </Text>
        </div>
        
        {imageFile?.previewUrl && (
          <div className="mb-3 rounded-lg overflow-hidden">
            <img
              src={imageFile.previewUrl}
              alt="Preview"
              className="w-full h-40 object-cover"
            />
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center">
            <ClockCircleOutlined className="mr-1" />
            2 minutes ago
          </span>
          <Tag color="blue" className="border-0 text-xs">
            {currentNotificationType?.label || 'Notification'}
          </Tag>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex space-x-2">
        <Button size="small" className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100">
          Dismiss
        </Button>
        <Button type="primary" size="small" className="flex-1 bg-blue-600 hover:bg-blue-700">
          View
        </Button>
      </div>
    </div>
  );

  // Facebook-style Email Notification
  const EmailNotification = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Email header - Gmail style */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar 
              size={40} 
              style={{ backgroundColor: '#1877f2' }}
              icon={<BellOutlined />}
            />
            <div>
              <Text strong className="block text-gray-900">
                Your App Notifications
              </Text>
              <Text type="secondary" className="text-sm">
                noreply@yourapp.com
              </Text>
            </div>
          </div>
          <Text type="secondary" className="text-sm">
            2 min ago
          </Text>
        </div>
        
        <Text strong className="text-lg text-gray-900 block">
          {title || 'You have a new notification'}
        </Text>
      </div>
      
      {/* Email content */}
      <div className="px-6 py-8">
        <div className="bg-gray-50 border-l-4 border-blue-500 rounded-r-lg p-4 mb-6">
          <Text className="text-gray-700 text-base leading-relaxed">
            {body || 'This is your notification content. You can customize this message to include any information you want to share with your users.'}
          </Text>
        </div>
        
        {imageFile?.previewUrl && (
          <div className="mb-6 text-center">
            <img
              src={imageFile.previewUrl}
              alt="Preview"
              className="max-w-full h-auto rounded-lg shadow-sm inline-block"
              style={{ maxHeight: '300px' }}
            />
          </div>
        )}
        
        <div className="text-center">
          <Button 
            type="primary" 
            size="large"
            className="bg-blue-600 hover:bg-blue-700 border-0 rounded-md px-8 py-2 h-auto font-medium"
          >
            View in App
          </Button>
        </div>
      </div>
      
      {/* Email footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 text-center">
        <Text type="secondary" className="text-sm block mb-2">
          You're receiving this because you're subscribed to notifications.
        </Text>
        <Button type="link" className="text-gray-500 hover:text-gray-700 p-0 h-auto text-sm">
          Unsubscribe from these notifications
        </Button>
      </div>
    </div>
  );

  const renderNotification = () => {
    switch(previewDevice) {
      case 'mobile': return <MobileNotification />;
      case 'desktop': return <DesktopNotification />;
      case 'email': return <EmailNotification />;
      default: return <DesktopNotification />;
    }
  };

  return (
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
      width={previewDevice === 'desktop' ? 500 : previewDevice === 'email' ? 700 : 400}
      className="preview-modal"
      centered
    >
      <div className="mb-4">
        <Radio.Group 
          value={previewDevice} 
          onChange={e => setPreviewDevice(e.target.value)}
          buttonStyle="solid"
          className="w-full flex"
        >
          <Radio.Button value="mobile" className="flex-1 text-center">
            <MobileOutlined className="mr-1" /> Mobile
          </Radio.Button>
          <Radio.Button value="desktop" className="flex-1 text-center">
            <DesktopOutlined className="mr-1" /> Desktop
          </Radio.Button>
          <Radio.Button value="email" className="flex-1 text-center">
            <MailOutlined className="mr-1" /> Email
          </Radio.Button>
        </Radio.Group>
      </div>
      
      <div className="flex justify-center">
        {renderNotification()}
      </div>
    </Modal>
  );
};

export default NotificationPreview;