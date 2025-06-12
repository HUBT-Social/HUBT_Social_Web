import React, { useMemo } from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { UserInfo } from '../../../types/userInfo';

interface Props {
  teachers: UserInfo[];
  onClickAction: (key: string) => void;
}

const TeacherTable: React.FC<Props> = ({ teachers, onClickAction}) => {
  const columns: ColumnsType<UserInfo> = useMemo(
    () => [
      {
        title: 'Tên giáo viên',
        key: 'fullName',
        sorter: (a: UserInfo, b: UserInfo) =>
          `${a.lastName || ''} ${a.firstName || ''}`
            .toLowerCase()
            .localeCompare(`${b.lastName || ''} ${b.firstName || ''}`.toLowerCase()),
        render: (_: any, record: UserInfo) =>
          `${record.lastName || ''} ${record.firstName || ''}`.trim() || 'Chưa cập nhật',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        render: (email: string) => (
          <span className="text-blue-600 hover:underline">{email || 'Chưa cập nhật'}</span>
        ),
      },
      {
        title: 'Số điện thoại',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        render: (phoneNumber: string) => phoneNumber || 'Chưa cập nhật',
      },
      {
        title: 'Giới tính',
        dataIndex: 'gender',
        key: 'gender',
        filters: [
          { text: 'Nam', value: 1 },
          { text: 'Nữ', value: 0 },
          { text: 'Chưa xác định', value: -1 },
        ],
        onFilter: (value, record: UserInfo) =>
          record.gender === value || (value === -1 && record.gender == null),
        render: (gender: number | undefined) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              gender === 1
                ? 'bg-blue-100 text-blue-800'
                : gender === 0
                ? 'bg-pink-100 text-pink-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {gender === 1 ? 'Nam' : gender === 0 ? 'Nữ' : 'Chưa xác định'}
          </span>
        ),
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        filters: [
          { text: 'Hoạt động', value: 'Active' },
          { text: 'Không hoạt động', value: 'Inactive' },
        ],
        onFilter: (value, record: UserInfo) => record.status === value,
        render: (status: string) => (
          <Tag color={status === 'Active' ? 'green' : 'red'}>
            {status === 'Active' ? 'Hoạt động' : 'Không hoạt động'}
          </Tag>
        ),
      },
      {
        title: 'Khoa',
        key: 'faculty',
        render: () => <span className="text-gray-600">Chưa phân khoa</span>,
      },
    ],
    [teachers]
  );

  return (
    <Table
      className="hover:cursor-pointer"
      columns={columns}
      dataSource={teachers} // Ensure max pageSize rows
      rowKey="userName"
      pagination={{ pageSize: 8 }} // Pagination handled in TeacherList
      onRow={(record: UserInfo) => ({
        onClick: () => onClickAction(record.userName),
      })}
    />
  );
};

export default TeacherTable;