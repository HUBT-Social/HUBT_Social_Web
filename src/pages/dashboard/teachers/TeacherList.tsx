import { Card, Spin } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '../../../store/store';

import {
  getTeachers,
  selectIsLoaded,
  selectTeachersError,
  selectTeachersFiltered,
  selectTeachersLoading,
} from '../../../store/slices/teacherSlice';
import TeacherEmpty from './TeacherEmpty';

import { AlertCircle } from 'lucide-react';
import TeacherTable from './TeacherTable';

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
        <TeacherTable teachers={teacherFiltered} onClickAction={handleViewDetail}/>
      )}
    </Card>
  );
};

export default TeacherList;