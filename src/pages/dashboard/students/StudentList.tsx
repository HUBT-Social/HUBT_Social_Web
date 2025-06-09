import { Button, Card, Spin } from 'antd';
import { AlertCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StudentFilter from '../../../components/StudentFilter';
import {
  getAverageScore,
  getStudents,
  selectIsLoaded,
  selectStudentsError,
  selectStudentsFiltered,
  selectStudentsLoading,
  setStudents
} from '../../../store/slices/studentSlice';
import { AppDispatch, store } from '../../../store/store';
import { UserInfo } from '../../../types/User';
import StudentDetail from './StudentDetail';
import StudentEmpty from './StudentEmpty';
import StudentTable from './StudentTable';

const StudentList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const students = useSelector(selectStudentsFiltered);
  const isLoading = useSelector(selectStudentsLoading);
  const error = useSelector(selectStudentsError);
  const isLoaded = useSelector(selectIsLoaded);
  const [currentStudent, setCurrentStudent] = useState<UserInfo | null>(null);

  const fetchStudentsData = async () => {
    try {
      let page = 1;
      const pageStop_Test=5;
      let hasMore = true;

      while (hasMore && page <= pageStop_Test) {
        const currentStudetsCount = store.getState().students.students.length;
        
        const response = await dispatch(getStudents(page)).unwrap();
        
        // Đợi state thay đổi
        await new Promise((resolve) => {
          const unsubscribe = store.subscribe(() => {
            const newCount = store.getState().students.students.length;
            if (newCount > currentStudetsCount) {
              unsubscribe();
              resolve(true);
            }
          });
        });
        
        hasMore = response?.hasMore;
        page += 1;
      }
      const currentMargeStudent = store.getState().students.mergeStudentsWithScores.length
      console.log("Curent student marge: ",currentMargeStudent);
      try
      {
          await dispatch(getAverageScore());
      await new Promise((resolve) => {
          const unsubscribe = store.subscribe(() => {
            const newCount = store.getState().students.mergeStudentsWithScores.length;
            if (newCount > currentMargeStudent) {
              unsubscribe();
              resolve(true);
            }
            console.log("Curent std: ",newCount);
          });
        });
      }catch{console.log("Loi lay diem nguoi dung")}
      
      console.log("Before: ",store.getState().students.mergeStudentsWithScores.length);
    } catch (err) {
      console.error('Lỗi khi fetch dữ liệu sinh vien:', err);
    }
    
  };

  useEffect(() => {
    if (!isLoaded && students.length === 0) {
      fetchStudentsData();
    }
  }, [isLoaded, students.length]);

  const handleViewDetail = (userName: string) => {
    const selected = students.find((stu) => stu.userName === userName);
    if (selected) {
      setCurrentStudent(selected);
    }
  };



  if (isLoading && students.length === 0) {
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
  const reLoading = () => {
      dispatch(setStudents([]));
      fetchStudentsData();
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
    <>
      <StudentFilter />
      <Card title="Danh sách sinh viên" className="rounded-lg shadow-md" extra={renderExtra()}>
        {students.length === 0 ? (
          <StudentEmpty />
        ) : (
          <div className="flex gap-6 mt-6">
            <div className="flex-1 bg-white p-4 rounded-lg shadow-md border">
              <StudentTable students={students} onClickAction={handleViewDetail}/>
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