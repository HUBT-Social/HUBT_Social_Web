import { SendOutlined } from '@ant-design/icons';
import { Alert, Button, DatePicker, Drawer, Input, Progress, Select, Space, Tag, Typography } from 'antd';
import React from 'react';
import { ChannelType, NotificationPriority, NotificationType } from '../../../../types/Notification';
import { channelOptions, notificationTypes, priorities } from '../constants/notificationConstants';

const { Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface NotificationDrawerProps {
  visible: boolean;
  onClose: () => void;
  selectedRowKeys: React.Key[];
  notificationType: NotificationType | '';
  setNotificationType: React.Dispatch<React.SetStateAction<NotificationType | ''>>;
  priority: NotificationPriority;
  setPriority: React.Dispatch<React.SetStateAction<NotificationPriority>>;
  channels: ChannelType[];
  setChannels: React.Dispatch<React.SetStateAction<ChannelType[]>>;
  customMessage: string;
  setCustomMessage: React.Dispatch<React.SetStateAction<string>>;
  scheduleDate: any;
  setScheduleDate: React.Dispatch<React.SetStateAction<any>>;
  onFinish: () => void;
  isLoading: boolean;
  darkMode: boolean;
}

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  visible,
  onClose,
  selectedRowKeys,
  notificationType,
  setNotificationType,
  priority,
  setPriority,
  channels,
  setChannels,
  customMessage,
  setCustomMessage,
  scheduleDate,
  setScheduleDate,
  onFinish,
  isLoading,
  darkMode
}) => {
  // useEffect(()=>{
  //   console.log("Message: ",customMessage);
  // },[customMessage]);


  return (
    <Drawer
      title="✨ Tạo thông báo mới"
      placement="right"
      onClose={onClose}
      open={visible}
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
  );
};

export default NotificationDrawer;