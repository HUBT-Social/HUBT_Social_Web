import React, { useMemo } from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { UserInfo } from '../../../types/User';


interface Props {
  students: UserInfo[];
  onClickAction: (key: string) => any;
}

const StudentTable: React.FC<Props> = ({ students, onClickAction}) => {
  const columns: ColumnsType<UserInfo> = useMemo(() => {
    return [
      {
        title: 'Họ tên',
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
        title: 'Ngành',
        dataIndex: 'faculty',
        key: 'faculty',
        filters: Array.from(
          new Set(
            students
              .map(stu => stu.className?.match(/^[A-Za-z]+/)?.[0])
              .filter((fac): fac is string => Boolean(fac)) // Type guard
          )
        ).map(fac => ({ text: fac, value: fac })),
        onFilter: (value, record: UserInfo) =>
          record.className?.startsWith(value as string) || false,
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
              .map(stu => stu.className?.match(/\d+/)?.[0])
              .filter((k): k is string => Boolean(k)) // Type guard
          )
        ).map(k => ({ text: `Khóa ${k}`, value: k })),
        onFilter: (value, record: UserInfo) => {
          const khoa = record.className?.match(/\d+/)?.[0];
          return khoa === value;
        },
        sorter: (a: UserInfo, b: UserInfo) => {
          const aK = parseInt(a.className?.match(/\d+/)?.[0] || '0');
          const bK = parseInt(b.className?.match(/\d+/)?.[0] || '0');
          return aK - bK;
        },
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
          new Set(students.map(s => s.className).filter((cls): cls is string => Boolean(cls)))
        ).map(cls => ({
          text: cls,
          value: cls,
        })),
        onFilter: (value, record: UserInfo) =>
          record.className === value,
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
          gender === 1 ? 'Nam' : 'Nữ',
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        filters: Array.from(
          new Set(students.map(s => s.status).filter((status): status is string => Boolean(status)))
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
    ];
  }, [students]);

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

// Ví dụ sử dụng:
/*
const studentsData: UserInfo[] = [
  {
    userName: "nguyenvana",
    firstName: "Văn A",
    lastName: "Nguyễn",
    className: "IT2021",
    gender: 1,
    status: "Active"
  },
  {
    userName: "tranthib",
    firstName: "Thị B",
    lastName: "Trần", 
    className: "CS2022",
    gender: 0,
    status: "Inactive"
  }
];

<StudentTable students={studentsData} />
*/