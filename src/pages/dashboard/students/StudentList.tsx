import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Card, Table, Tag, Spin, Alert, message } from 'antd';
import StudentEmpty from './StudentEmpty';
import StudentDetail from './StudentDetail';
import StudentFilter from '../../../components/StudentFilter';
import {
  getStudents,
  selectStudents,
  selectStudentsLoading,
  selectStudentsError,
  selectStudentsFiltered,
} from '../../../store/slices/studentSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { UserInfo } from '../../../types/User';
import { AlertCircle } from 'lucide-react';

interface GetStudentsPayload { // Define the expected payload structure
  users: UserInfo[];
  hasMore: boolean;
  message: string;
}

const StudentList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const students = useSelector(selectStudentsFiltered);
  const isLoading = useSelector(selectStudentsLoading);
  const error = useSelector(selectStudentsError);
  const hasFetchedRef = useRef(false);
  const [currentStudent, setCurrentStudent] = useState<UserInfo | null>(null);


  const handleViewDetail = (userName: string) => { // Changed to userName
    const selected = students.find((stu) => stu.userName === userName);
    if (selected) {
      setCurrentStudent(selected);
    }
  };

  const columns = [
    {
      title: 'Mã SV',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Họ tên',
      key: 'fullName',
      render: (_: any, record: any) =>
        `${record.lastName} ${record.firstName}`.trim(),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Lớp',
      dataIndex: 'className',
      key: 'className',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender: number) => (gender === 1 ? 'Nam' : 'Nữ'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Active' ? 'green' : 'red'}>{status}</Tag>
      ),
    },
  ];

  // Render different states
  if (isLoading && !students.length) { // Corrected condition
    return (
      <Card title="Danh sách sinh viên">
        <Spin tip="Đang tải..." />
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Danh sách sinh viên">
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="h-5 w-5" />
          <p>Lỗi khi tải danh sách sinh viên: {error}</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <StudentFilter />
      <Card title="Danh sách sinh viên" className="rounded-lg shadow-md">
        {students.length === 0 ? (
          <StudentEmpty /> //  Removed onRetry.  Handled in initial fetch.
        ) : (
          <div className="flex gap-6 mt-6">
            <div className="flex-1 bg-white p-4 rounded-lg shadow-md border">
              <Table
                className="hover:cursor-pointer"
                columns={columns}
                dataSource={students}
                rowKey="userName" // Changed to userName
                pagination={{ pageSize: 8 }}
                onRow={(record) => ({
                  onClick: () => handleViewDetail(record.userName), // Pass userName
                })}
              />
            </div>
            <div className="w-1/3 bg-white p-6 rounded-lg shadow-md border">
              {currentStudent ? (
                <StudentDetail
                  student={{
                    userName: currentStudent.userName,
                    email: currentStudent.email,
                    className: currentStudent.className,
                    gender: currentStudent.gender,
                    avataUrl: currentStudent.avataUrl,
                    phoneNumber: currentStudent.phoneNumber,
                    firstName: currentStudent.firstName,
                    lastName: currentStudent.lastName,
                    fcmToken: currentStudent.fcmToken,
                    status: currentStudent.status,
                    dateOfBirth: currentStudent.dateOfBirth,
                  }}
                  onEdit={() => console.log('Sửa thông tin')}
                  onDelete={() => {
                    console.log('Đã xóa học sinh');
                    setCurrentStudent(null);
                  }}
                />
              ) : (
                <div className="text-center text-gray-500">Chọn sinh viên để xem chi tiết</div>
              )}
            </div>
          </div>
        )}
      </Card>
    </>
  );
};

export default StudentList;

