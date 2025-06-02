import React, { useMemo } from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { UserInfo } from '../../../types/User';


interface Props {
  teachers: UserInfo[];
  onClickAction: (key: string) => any;
}

const TeacherTable: React.FC<Props> = ({ teachers,onClickAction }) => {
  const columns: ColumnsType<UserInfo> = useMemo(
    () => [
      {
        title: 'Tên giáo viên',
        key: 'fullName',
        sorter: (a: UserInfo, b: UserInfo) => {
          const nameA = `${a.lastName} ${a.firstName}`.toLowerCase();
          const nameB = `${b.lastName} ${b.firstName}`.toLowerCase();
          return nameA.localeCompare(nameB);
        },
        render: (_: any, record: UserInfo) =>
          `${record.lastName} ${record.firstName}`.trim(),
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Số điện thoại',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
      },
      {
        title: 'Giới tính',
        dataIndex: 'gender',
        key: 'gender',
        filters: [
          { text: 'Nam', value: 1 },
          { text: 'Nữ', value: 0 },
        ],
        onFilter: (value, record: UserInfo) =>
          record.gender === value,
        render: (gender: number) =>
          <Tag color={gender === 1 ? 'blue' : 'pink'}>{gender === 1 ? 'Nam' : 'Nữ'}</Tag>
      },
      {
        title: 'Ngày sinh',
        dataIndex: 'dateOfBirth',
        key: 'dateOfBirth',
        render: (dob: string) =>
          dob && dob !== '0001-01-01T00:00:00'
            ? moment(dob).format('DD/MM/YYYY')
            : 'Chưa cập nhật',
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        filters: Array.from(
          new Set(teachers.map(t => t.status).filter((status): status is string => Boolean(status)))
        ).map(status => ({
          text: status,
          value: status,
        })),
        onFilter: (value, record: UserInfo) =>
          record.status === value,
        render: (status: string) => (
          <Tag color={status === 'Active' ? 'green' : 'red'}>{status}</Tag>
        ),
      },
    ],
    [teachers]
  );

  return (
    <Table
      dataSource={teachers}
      columns={columns}
      rowKey="userName"
      onRow={(record: UserInfo) => ({
        onClick: () => onClickAction(record.userName),
        })}
    />

  );
};

export default TeacherTable;

// Ví dụ sử dụng:
/*
const teachersData: UserInfo[] = [
  {
    userName: "teacher001",
    firstName: "Văn A",
    lastName: "Nguyễn",
    email: "nguyenvana@school.edu.vn",
    phoneNumber: "0123456789",
    gender: 1,
    dateOfBirth: "1985-05-15T00:00:00",
    status: "Active"
  },
  {
    userName: "teacher002",
    firstName: "Thị B",
    lastName: "Trần",
    email: "tranthib@school.edu.vn", 
    phoneNumber: "0987654321",
    gender: 0,
    dateOfBirth: "0001-01-01T00:00:00", // Chưa cập nhật
    status: "Inactive"
  }
];

<TeacherTable teachers={teachersData} />
*/