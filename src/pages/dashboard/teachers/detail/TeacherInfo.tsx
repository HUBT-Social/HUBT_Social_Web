import { Button } from 'antd';
import React from 'react';
import { UserInfo } from '../../../../types/user';

interface TeacherInfoProps {
  teacher: UserInfo;
  onEdit: () => void;
  onUpdatePassword: () => void;
  onDelete: () => void;
  onBack: () => void;
}

const TeacherInfo: React.FC<TeacherInfoProps> = ({
  teacher,
  onEdit,
  onUpdatePassword,
  onDelete,
  onBack,
}) => {
  const formatGender = (gender: number): string => {
    switch (gender) {
      case 1: return 'Nam';
      case 0: return 'Nữ';
      default: return 'Khác';
    }
  };

  const formatDate = (dateString: string | any): string => {
    return dateString ? new Date(dateString).toLocaleDateString('vi-VN') : 'N/A';
  };

  const infoItems = [
    { label: 'ID', value: teacher.id },
    { label: 'Tên đăng nhập', value: teacher.userName },
    { label: 'Email', value: teacher.email },
    { label: 'Điện thoại', value: teacher.phoneNumber || 'N/A' },
    { label: 'Giới tính', value: formatGender(teacher.gender) },
    { label: 'Ngày sinh', value: formatDate(teacher.dateOfBirth) },
    { label: 'Trạng thái', value: teacher.status },
  ];

  return (
    <div className="flex-1">
      <h3 className="text-xl font-semibold text-gray-700 mb-6">Thông tin chi tiết</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {infoItems.map((item, index) => (
          <div key={index} className="space-y-1">
            <span className="font-medium text-gray-600 text-sm">{item.label}:</span>
            <p className="text-gray-800 break-words">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 justify-end">
        <Button onClick={onBack}>
          Quay lại
        </Button>
        <Button type="primary" onClick={onEdit}>
          Chỉnh sửa
        </Button>
        <Button type="primary" onClick={onUpdatePassword}>
          Cập nhật mật khẩu
        </Button>
        <Button danger onClick={onDelete}>
          Xóa
        </Button>
      </div>
    </div>
  );
};

export default TeacherInfo;