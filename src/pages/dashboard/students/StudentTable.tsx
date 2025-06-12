import React, { useMemo } from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { UserInfo } from '../../../types/userInfo';

interface Props {
  students: UserInfo[];
  onClickAction: (key: string) => void;
}

const StudentTable: React.FC<Props> = ({ students, onClickAction }) => {
  const columns: ColumnsType<UserInfo> = useMemo(
    () => [
      {
        title: 'Họ tên',
        key: 'fullName',
        sorter: (a: UserInfo, b: UserInfo) =>
          `${a.lastName} ${a.firstName}`.toLowerCase().localeCompare(
            `${b.lastName} ${b.firstName}`.toLowerCase()
          ),
        render: (_: any, record: UserInfo) =>
          `${record.lastName} ${record.firstName}`.trim(),
      },
      {
        title: 'Ngành',
        dataIndex: 'faculty',
        key: 'faculty',
        filters: Array.from(
          new Set(
            students
              .map((stu) => stu.className?.match(/^[A-Za-z]+/)?.[0])
              .filter((fac): fac is string => Boolean(fac))
          )
        ).map((fac) => ({ text: fac, value: fac })),
        onFilter: (value, record: UserInfo) =>
          record.className?.startsWith(value as string) ?? false,
        render: (_: any, record: UserInfo) => {
          const faculty = record.className?.match(/^[A-Za-z]+/)?.[0] || 'N/A';
          return <Tag color="blue">{faculty}</Tag>;
        },
      },
      {
        title: 'Khóa',
        dataIndex: 'className',
        key: 'khoa',
        filters: Array.from(
          new Set(
            students
              .map((stu) => stu.className?.match(/\d+/)?.[0])
              .filter((k): k is string => Boolean(k))
          )
        ).map((k) => ({ text: `Khóa ${k}`, value: k })),
        onFilter: (value, record: UserInfo) =>
          record.className?.match(/\d+/)?.[0] === value,
        sorter: (a: UserInfo, b: UserInfo) =>
          parseInt(a.className?.match(/\d+/)?.[0] || '0') -
          parseInt(b.className?.match(/\d+/)?.[0] || '0'),
        render: (_: any, record: UserInfo) => {
          const khoa = record.className?.match(/\d+/)?.[0] || 'N/A';
          return <Tag color="purple">Khóa {khoa}</Tag>;
        },
      },
      {
        title: 'Lớp',
        dataIndex: 'className',
        key: 'class',
        filters: Array.from(
          new Set(students.map((s) => s.className).filter((cls): cls is string => Boolean(cls)))
        ).map((cls) => ({ text: cls, value: cls })),
        onFilter: (value, record: UserInfo) => record.className === value,
      },
      {
        title: 'Giới tính',
        dataIndex: 'gender',
        key: 'gender',
        filters: [
          { text: 'Nam', value: 1 },
          { text: 'Nữ', value: 0 },
        ],
        onFilter: (value, record: UserInfo) => record.gender === value,
        render: (gender: number) => (gender === 1 ? 'Nam' : 'Nữ'),
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        filters: Array.from(
          new Set(students.map((s) => s.status).filter((status): status is string => Boolean(status)))
        ).map((status) => ({ text: status, value: status })),
        onFilter: (value, record: UserInfo) => record.status === value,
        render: (status: string) => (
          <Tag color={status === 'Active' ? 'green' : 'red'}>{status}</Tag>
        ),
      },
    ],
    [students]
  );

  return (
    <Table
      className="hover:cursor-pointer"
      columns={columns}
      dataSource={students}
      rowKey="userName"
      pagination={{ pageSize: 8 }}
      onRow={(record: UserInfo) => ({
        onClick: () => onClickAction(record.userName),
      })}
    />
  );
};

export default StudentTable;