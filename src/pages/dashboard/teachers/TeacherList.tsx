import { Button, Card, Spin } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '../../../store/store';
import {store} from '../../../store/store';

import {
  getTeachers,
  selectIsLoaded,
  selectTeachersError,
  selectTeachersFiltered,
  selectTeachersLoading,
  setTeachers,
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

  const fetchTeachersData = async () => {
    console.log('Bắt đầu fetchTeachersData');
    try {
      let page = 0;
      console.log('Khởi tạo page:', page);
      let hasMore = true;
      console.log('Khởi tạo hasMore:', hasMore);
      while (hasMore) {
        console.log('Vào vòng lặp while, page hiện tại:', page);
        const currentTeachersCount = store.getState().teachers.teachers.length;
        console.log('Số lượng giáo viên hiện tại:', currentTeachersCount);
       
        const response = await dispatch(getTeachers(page)).unwrap();
        console.log('Response từ getTeachers:', response);
       
        // Đợi state thay đổi
        console.log('Bắt đầu đợi state thay đổi');
        await new Promise((resolve) => {
          console.log('Tạo Promise để theo dõi thay đổi state');
          const unsubscribe = store.subscribe(() => {
            const newCount = store.getState().teachers.teachers.length;
            console.log('State thay đổi, số lượng mới:', newCount, 'số lượng cũ:', currentTeachersCount);
            if (newCount > currentTeachersCount) {
              console.log('State đã cập nhật với số lượng mới, unsubscribe');
              unsubscribe();
              resolve(true);
            }
          });
        });
        console.log('Hoàn thành đợi state thay đổi');
       
        hasMore = response?.hasMore;
        console.log('Cập nhật hasMore:', hasMore);
        page += 1;
        console.log('Tăng page lên:', page);
      }
      console.log('Kết thúc vòng lặp while');
    } catch (err) {
      console.error('Lỗi khi fetch dữ liệu giáo viên:', err);
    }
    console.log('Kết thúc fetchTeachersData');
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

  const reLoading = () => {
      dispatch(setTeachers([]));
      fetchTeachersData();
  }

  const renderExtra = () => {
    return (
      <div>
        <Button onClick={reLoading}>Reload</Button>
        <Button>Xuất Excel</Button>
      </div>
    );
  };

  return (
    <Card title="Danh sách giáo viên" extra={renderExtra()}>
      {teacherFiltered.length === 0 ? (
        <TeacherEmpty />
      ) : (
        <TeacherTable teachers={teacherFiltered} onClickAction={handleViewDetail}/>
      )}
    </Card>
  );
};

export default TeacherList;