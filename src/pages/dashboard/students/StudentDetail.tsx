import React from 'react';
import { Avatar, Button, Card, Tooltip, Popconfirm, message } from 'antd';
import { MailOutlined, PhoneOutlined, MessageOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface StudentDetailProps {
  id: string;
  name: string;
  email: string;
  className: string;
  gender: string;
  age: number;
  avatarUrl: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const StudentDetail: React.FC<StudentDetailProps> = ({
  id,
  name,
  email,
  className,
  gender,
  age,
  avatarUrl,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className="">
      <p className="text-center text-gray-500 text-sm">{id}</p>

      <div className="flex justify-center mt-2">
        <Avatar size={100} src={avatarUrl} />
      </div>

      <h2 className="text-center text-lg font-semibold mt-4">{name}: {email}</h2>
      <p className="text-center text-sm text-gray-500 mb-4">{className} student</p>

      {/* Action buttons */}
      <div className="flex justify-center gap-4 text-gray-600 mb-4">
        <Tooltip title="Email">
          <Button shape="circle" icon={<MailOutlined />} />
        </Tooltip>
        <Tooltip title="Call">
          <Button shape="circle" icon={<PhoneOutlined />} />
        </Tooltip>
        <Tooltip title="Message">
          <Button shape="circle" icon={<MessageOutlined />} />
        </Tooltip>
      </div>

      {/* About */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-1">About</h3>
        <p className="text-gray-500 text-sm italic">—</p>
      </div>

      {/* Age & Gender */}
      <div className="flex justify-between text-sm text-gray-700 mb-4">
        <div><span className="font-semibold">Age: </span>{age}</div>
        <div><span className="font-semibold">Gender: </span>{gender}</div>
      </div>

      {/* Buttons */}
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
