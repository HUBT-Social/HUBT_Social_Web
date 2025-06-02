import React from 'react';
import { Avatar, Button, Space, Tooltip } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  NotificationOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import { UserInfo } from '../../../../types/User';

interface TeacherAvatarProps {
  teacher: UserInfo;
  onSendNotification: () => void;
  onSendEmail: () => void;
  onOpenChat: () => void;
}

const TeacherAvatar: React.FC<TeacherAvatarProps> = ({
  teacher,
  onSendNotification,
  onSendEmail,
  onOpenChat,
}) => {
  return (
    <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
      <Avatar
        size={150}
        src={teacher.avataUrl}
        icon={<UserOutlined />}
        className="border-2 border-blue-500 mb-4"
      />
      <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center md:text-left">
        {teacher.firstName} {teacher.lastName}
      </h2>
      
      <Space size="middle" className="mb-4">
        {teacher.fcmToken && (
          <Tooltip title="Gửi thông báo">
            <Button
              shape="circle"
              icon={<NotificationOutlined />}
              onClick={onSendNotification}
            />
          </Tooltip>
        )}

        {teacher.email && (
          <Tooltip title="Gửi email">
            <Button
              shape="circle"
              icon={<MailOutlined />}
              onClick={onSendEmail}
            />
          </Tooltip>
        )}

        <Tooltip title="Nhắn tin">
          <Button
            shape="circle"
            icon={<MessageOutlined />}
            onClick={onOpenChat}
          />
        </Tooltip>
      </Space>
    </div>
  );
};

export default TeacherAvatar;