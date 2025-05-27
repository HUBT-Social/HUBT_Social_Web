import React, { useEffect, useMemo } from 'react';
import { Card, Spin, Table, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../../store/store';

import TeacherEmpty from './TeacherEmpty';
import {
  selectTeachersFiltered,
  selectTeachersError,
  selectTeachersLoading,
  selectIsLoaded,
  getTeachers,
} from '../../../store/slices/teacherSlice';

import moment from 'moment';
import { AlertCircle } from 'lucide-react';
import { UserInfo } from '../../../types/User';

const TeacherList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const teacherFiltered = useSelector(selectTeachersFiltered);
  const error = useSelector(selectTeachersError);
  const loading = useSelector(selectTeachersLoading);
  const isLoaded = useSelector(selectIsLoaded);

  // Fetch teacher data
  const fetchTeachersData = async () => {
    try {
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await dispatch(getTeachers(page)).unwrap();
        hasMore = response?.hasMore;
        page += 1;
      }
    } catch (err) {
      console.error('Lỗi khi fetch dữ liệu giáo viên:', err);
    }
  };

  useEffect(() => {
    if (!isLoaded && teacherFiltered.length === 0) {
      fetchTeachersData();
    }
  }, [isLoaded, teacherFiltered.length]);

  const handleViewDetail = (id: string) => {
    navigate(`/dashboard/teachers/${id}`);
  };

  const columns = useMemo(
    () => [
      {
        title: 'Tên giáo viên',
        key: 'fullName',
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

  if (loading && teacherFiltered.length === 0) {
    return (
      <Card title="Danh sách giáo viên">
        <Spin tip="Đang tải dữ liệu..." />
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Danh sách giáo viên">
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="w-5 h-5" />
          <p>Lỗi khi tải danh sách giáo viên: {error}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Danh sách giáo viên">
      {teacherFiltered.length === 0 ? (
        <TeacherEmpty />
      ) : (
        <Table
          columns={columns}
          dataSource={teacherFiltered}
          rowKey="userName"
          onRow={(record: UserInfo) => ({
            onClick: () => handleViewDetail(record.userName),
          })}
        />
      )}
    </Card>
  );
};

export default TeacherList;