import {
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  IdcardOutlined,
  MailOutlined,
  MessageOutlined,
  NotificationOutlined,
  PhoneOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Divider,
  message,
  Popconfirm,
  Tag,
  Tooltip,
  Typography
} from 'antd';
import React from 'react';

const { Title, Text } = Typography;

interface StudentDetailProps {
  student: {
    userName: string;
    email: string | null;
    avataUrl: string;
    phoneNumber: string | null;
    firstName: string;
    lastName: string;
    fcmToken: string;
    status: string;
    gender: number;
    dateOfBirth?: string;
    className: string | null;
  };
  onEdit?: () => void;
  onDelete?: () => void;
}

const StudentDetail: React.FC<StudentDetailProps> = ({
  student,
  onEdit,
  onDelete,
}) => {
  const {
    userName,
    email,
    avataUrl,
    phoneNumber,
    firstName,
    lastName,
    fcmToken,
    status,
    gender,
    dateOfBirth,
    className,
  } = student;

  const genderLabel = gender === 1 ? 'Nam' : gender === 2 ? 'Nữ' : 'Khác';
  const fullName = `${lastName} ${firstName}`;

  const handleSendNotification = () => {
    console.log('Gửi thông báo đến người dùng có FCM token:', fcmToken);
    message.success('Đã gửi thông báo thành công!');
  };

  const handleSendEmail = () => {
    if (email) {
      window.location.href = `mailto:${email}`;
    } else {
      message.warning('Học sinh chưa có email!');
    }
  };

  const handleSendMessage = () => {
    console.log('Chuyển đến giao diện nhắn tin với:', userName);
    message.info('Mở giao diện nhắn tin...');
  };

  const handleCall = () => {
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      message.warning('Học sinh chưa có số điện thoại!');
    }
  };

  const InfoItem = ({ icon, label, value, color = "default" }: { 
    icon: React.ReactNode; 
    label: string; 
    value: string; 
    color?: string;
  }) => (
    <div className="flex items-center space-x-3 py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={`text-${color === 'default' ? 'gray-500' : color} text-lg`}>
        {icon}
      </div>
      <div className="flex-1">
        <Text className="text-gray-500 text-sm block">{label}</Text>
        <Text className="text-gray-800 font-medium">{value}</Text>
      </div>
    </div>
  );

  return (
    <Card className="max-w-md mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Header với avatar và tên */}
      <div className="text-center pb-6">
        <div className="relative inline-block">
          <Avatar 
            size={120} 
            src={avataUrl || undefined} 
            icon={<UserOutlined />}
            className="border-4 border-white shadow-lg"
          />
          <div className="absolute -bottom-2 -right-2">
            <Tag 
              color={status === 'Active' ? 'success' : 'error'} 
              className="border-2 border-white rounded-full px-3 py-1 font-medium"
            >
              {status === 'Active' ? 'Hoạt động' : 'Không hoạt động'}
            </Tag>
          </div>
        </div>
        
        <Title level={3} className="mt-4 mb-1 text-gray-800">
          {fullName}
        </Title>
        
        <div className="flex items-center justify-center space-x-2 text-gray-500">
          <IdcardOutlined />
          <Text className="text-sm">Mã SV: {userName}</Text>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center space-x-2 mb-6">
        {fcmToken && (
          <Tooltip title="Gửi thông báo">
            <Button 
              type="primary" 
              shape="circle" 
              icon={<NotificationOutlined />} 
              onClick={handleSendNotification}
              className="bg-blue-500 hover:bg-blue-600 border-0"
            />
          </Tooltip>
        )}
        
        {email && (
          <Tooltip title="Gửi email">
            <Button 
              type="primary" 
              shape="circle" 
              icon={<MailOutlined />} 
              onClick={handleSendEmail}
              className="bg-green-500 hover:bg-green-600 border-0"
            />
          </Tooltip>
        )}
        
        {phoneNumber && (
          <Tooltip title="Gọi điện thoại">
            <Button 
              type="primary" 
              shape="circle" 
              icon={<PhoneOutlined />} 
              onClick={handleCall}
              className="bg-orange-500 hover:bg-orange-600 border-0"
            />
          </Tooltip>
        )}
        
        <Tooltip title="Nhắn tin">
          <Button 
            type="primary" 
            shape="circle" 
            icon={<MessageOutlined />} 
            onClick={handleSendMessage}
            className="bg-purple-500 hover:bg-purple-600 border-0"
          />
        </Tooltip>
      </div>

      <Divider className="my-4" />

      {/* Thông tin chi tiết */}
      <div className="space-y-1">
        <InfoItem 
          icon={<MailOutlined />} 
          label="Email" 
          value={email || 'Chưa cập nhật'} 
          color={email ? 'blue-500' : 'default'}
        />
        
        <InfoItem 
          icon={<PhoneOutlined />} 
          label="Số điện thoại" 
          value={phoneNumber || 'Chưa cập nhật'} 
          color={phoneNumber ? 'green-500' : 'default'}
        />
        
        <InfoItem 
          icon={<UserOutlined />} 
          label="Giới tính" 
          value={genderLabel} 
        />
        
        <InfoItem 
          icon={<CalendarOutlined />} 
          label="Ngày sinh" 
          value={dateOfBirth ? new Date(dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'} 
        />
        
        <InfoItem 
          icon={<TeamOutlined />} 
          label="Lớp học" 
          value={className || 'Chưa phân lớp'} 
          color={className ? 'purple-500' : 'default'}
        />
      </div>

      <Divider className="my-6" />

      {/* Action buttons */}
      <div className="flex space-x-3">
        <Button 
          type="primary" 
          icon={<EditOutlined />} 
          onClick={onEdit}
          className="flex-1 h-10 bg-blue-500 hover:bg-blue-600 border-0"
        >
          Chỉnh sửa
        </Button>
        
        <Popconfirm
          title="Xóa học sinh"
          description="Bạn có chắc chắn muốn xóa học sinh này không?"
          onConfirm={() => {
            onDelete?.();
            message.success('Đã xóa học sinh thành công');
          }}
          okText="Xóa"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
        >
          <Button 
            danger 
            icon={<DeleteOutlined />}
            className="h-10 px-6"
          >
            Xóa
          </Button>
        </Popconfirm>
      </div>
    </Card>
  );
};

export default StudentDetail;