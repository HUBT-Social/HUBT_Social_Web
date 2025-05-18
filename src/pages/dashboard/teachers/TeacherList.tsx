import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Card, Spin, Table, Tag, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../../store/store';
import TeacherEmpty from './TeacherEmpty';
import {
  selectTeachersFiltered,
  selectTeachersLoading,
  selectTeachersError,
  getTeachers,
  selectIsLoaded,
} from '../../../store/slices/teacherSlice';
import moment from 'moment';
import { AlertCircle } from 'lucide-react';
import { UserInfo } from '../../../types/User';

interface GetTeachersPayload {
  users: UserInfo[];
  hasMore: boolean;
  message: string;
}

const TeacherList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isloaded = useSelector(selectIsLoaded);


  const [loading, setLoading] = useState(false); // Sử dụng state nội bộ để quản lý loading
  const teacherFiltered = useSelector(selectTeachersFiltered);
  const error = useSelector(selectTeachersError);



  const handleViewDetail = (id: string) => {
    navigate(`/dashboard/teachers/${id}`);
  };

  // Memoize columns để tránh re-render Table không cần thiết
    const columns = useMemo(
    () => [
      {
        title: 'Tên giáo viên',
        key: 'fullName',
        render: (_: any, record: any) => `${record.lastName} ${record.firstName}`.trim(),
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
        render: (gender: number) => (gender === 1 ? 'Nam' : 'Nữ'),
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
        render: (status: string) => (
          <Tag color={status === 'Active' ? 'green' : 'red'}>{status}</Tag>
        ),
      },
    ],
    []
  );

  // Render different states
  if (loading && !teacherFiltered.length) { // changed from isLoading to loading
    return (
      <Card title="Danh sách giáo viên">
        <Spin tip="Đang tải..." />
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Danh sách giáo viên">
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="h-5 w-5" />
          <p>Lỗi khi tải danh sách giáo viên: {error}</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card title="Danh sách giáo viên">
        {teacherFiltered.length === 0 ? (
          <TeacherEmpty />
        ) : (
          <Table
            columns={columns}
            dataSource={teacherFiltered}
            rowKey="userName"
            onRow={(record) => ({
              onClick: () => handleViewDetail(record.userName),
            })}
          />
        )}
      </Card>
    </>
  );
};

export default TeacherList;

