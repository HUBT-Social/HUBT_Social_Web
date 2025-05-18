import React from 'react';
import {
  Avatar,
  Button,
  Card,
  Tooltip,
  Popconfirm,
  message,
  Descriptions,
  Tag,
} from 'antd';
import {
  MailOutlined,
  PhoneOutlined,
  MessageOutlined,
  EditOutlined,
  DeleteOutlined,
  NotificationOutlined,
} from '@ant-design/icons';

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

  const handleSendNotification = () => {
    console.log('Gửi thông báo đến người dùng có FCM token:', fcmToken);
  };

  const handleSendEmail = () => {
    if (email) window.location.href = `mailto:${email}`;
  };

  const handleSendMessage = () => {
    console.log('Chuyển đến giao diện nhắn tin với:', userName);
  };

  return (
    <Card>
      <div className="text-center text-gray-500 text-sm">Mã sinh viên: {userName}</div>

      <div className="flex justify-center mt-2">
        <Avatar size={100} src={avataUrl || undefined} />
      </div>

      <h2 className="text-center text-lg font-semibold mt-4">{`${lastName} ${firstName}`}</h2>

      <div className="text-center mb-4">
        <Tag color={status === 'Active' ? 'green' : 'red'}>{status}</Tag>
      </div>

      <div className="flex justify-center gap-4 text-gray-600 mb-4">
        <Tooltip title="Gửi thông báo">
          <Button shape="circle" icon={<NotificationOutlined />} onClick={handleSendNotification} />
        </Tooltip>
        <Tooltip title="Gửi email">
          <Button shape="circle" icon={<MailOutlined />} onClick={handleSendEmail} />
        </Tooltip>
        <Tooltip title="Nhắn tin">
          <Button shape="circle" icon={<MessageOutlined />} onClick={handleSendMessage} />
        </Tooltip>
      </div>

      <Descriptions column={1} size="small" bordered>
        <Descriptions.Item label="Họ và tên">
          {`${lastName} ${firstName}`}
        </Descriptions.Item>
        <Descriptions.Item label="Email">{email || '—'}</Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">{phoneNumber || '—'}</Descriptions.Item>
        <Descriptions.Item label="Giới tính">{genderLabel}</Descriptions.Item>
        <Descriptions.Item label="Ngày sinh">
          {dateOfBirth ? new Date(dateOfBirth).toLocaleDateString('vi-VN') : '—'}
        </Descriptions.Item>
        <Descriptions.Item label="Lớp">{className || '—'}</Descriptions.Item>
        <Descriptions.Item label="FCM Token">{fcmToken ? fcmToken.substring(0, 20) + '...' : '—'}</Descriptions.Item>
      </Descriptions>

      <div className="flex justify-center gap-4 mt-6">
        <Button icon={<EditOutlined />} onClick={onEdit}>
          Sửa thông tin
        </Button>
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa học sinh này không?"
          onConfirm={() => {
            onDelete?.();
            message.success('Đã xóa học sinh');
          }}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button danger icon={<DeleteOutlined />}>
            Xóa
          </Button>
        </Popconfirm>
      </div>
    </Card>
  );
};

export default StudentDetail;
