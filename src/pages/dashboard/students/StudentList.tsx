import { Button, Card, Spin, message } from 'antd';
import { AlertCircle, RefreshCw } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StudentFilter from '../../../components/StudentFilter';
import {
  getStudents,
  loadMoreStudents,
  selectStudents,
  selectStudentsFiltered,
  selectStudentsError,
  selectStudentsLoading,
  selectHasMore,
  clearStudents,
  selectCurrentFilters,
} from '../../../store/slices/studentSlice';
import { AppDispatch } from '../../../store/store';
import StudentDetail from './StudentDetail';
import StudentEmpty from './StudentEmpty';
import StudentTable from './StudentTable';
import { UserInfo } from '../../../types/userInfo';

const StudentList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Selectors
  const students = useSelector(selectStudents);
  const studentsFiltered = useSelector(selectStudentsFiltered);
  const loading = useSelector(selectStudentsLoading);
  const error = useSelector(selectStudentsError);
  const hasMore = useSelector(selectHasMore);
  const currentFilter = useSelector(selectCurrentFilters);

  // Local state
  const [currentStudent, setCurrentStudent] = useState<UserInfo | null>(null);
  const hasFetchedInitial = useRef(false);

  // Load initial data
  useEffect(() => {
    if (!hasFetchedInitial.current && !loading && !error && students.length === 0) {
      hasFetchedInitial.current = true;
      loadInitialStudents();
    }
  }, []);

  // Load initial students
  const loadInitialStudents = useCallback(async () => {
    try {
      await dispatch(getStudents({ page: 1 })).unwrap();
    } catch (err: any) {
      message.error(err?.message || 'Không thể tải danh sách sinh viên');
    }
  }, [dispatch]);

  // Handle load more
  const handleLoadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    
    try {
      await dispatch(loadMoreStudents()).unwrap();
    } catch (err: any) {
      message.error(err?.message || 'Không thể tải thêm sinh viên');
    }
  }, [dispatch, hasMore, loading]);

  // Handle reload
  const handleReload = useCallback(async () => {
    console.log('🔄 Reloading...');
    dispatch(clearStudents());
    hasFetchedInitial.current = false;
    
    try {
      await dispatch(getStudents({ page: 1 })).unwrap();
      hasFetchedInitial.current = true;
      setCurrentStudent(null);
    } catch (err: any) {
      message.error(err?.message || 'Không thể tải lại danh sách');
    }
  }, [dispatch]);

  // Handle export
  const handleExport = useCallback(() => {
    message.info('Chức năng xuất Excel đang được phát triển...');
  }, []);

  // Handle view detail
  const handleViewDetail = useCallback((userName: string) => {
    // Look in filtered list first, then fallback to all students
    const selected = studentsFiltered.find((stu) => stu.userName === userName) ||
                    students.find((stu) => stu.userName === userName);
    setCurrentStudent(selected ?? null);
  }, [students, studentsFiltered]);

  // Render extra buttons
  const renderExtra = () => (
    <div className="flex gap-2">
      <Button
        icon={<RefreshCw className="w-4 h-4" />}
        onClick={handleReload}
        disabled={loading}
      >
        {loading ? 'Đang tải...' : 'Reload'}
      </Button>
      <Button
        type="primary"
        onClick={handleExport}
        disabled={students.length === 0}
      >
        Xuất Excel
      </Button>
    </div>
  );

  // Get display data
  const displayStudents = studentsFiltered.length > 0 ? studentsFiltered : students;
  const showLoadMore = hasMore && !currentFilter.searchTerm; // Only show load more if not filtering

  return (
    <div className="max-w-7xl mx-auto py-6">
      <StudentFilter />
      <Card
        title={
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Danh sách sinh viên 
              {currentFilter.searchTerm && (
                <span className="text-sm font-normal text-blue-600 ml-2">
                  (Đang lọc: "{currentFilter.searchTerm}")
                </span>
              )}
            </h2>
            {renderExtra()}
          </div>
        }
        className="rounded-lg shadow-md"
      >
        <div className="min-h-[400px] relative">
          {loading && students.length === 0 ? (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-lg">
              <div className="text-center">
                <Spin size="large" />
                <p className="mt-4 text-gray-600 font-medium">
                  Đang tải danh sách sinh viên...
                </p>
                <p className="text-sm text-gray-500">Vui lòng đợi...</p>
              </div>
            </div>
          ) : null}

          {error && !loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Có lỗi xảy ra
              </h3>
              <p className="text-gray-600 mb-6 text-center max-w-md">{error}</p>
              <Button type="primary" size="large" onClick={handleReload}>
                Thử lại
              </Button>
            </div>
          ) : displayStudents.length === 0 && !loading ? (
            <StudentEmpty />
          ) : (
            <>
              <div className="flex gap-6 mt-6">
                <div className="flex-1 bg-white p-4 rounded-lg shadow-md border">
                  <div className="mb-4 text-sm text-gray-500">
                    Hiển thị {displayStudents.length} sinh viên
                    {currentFilter.searchTerm && ` (từ ${students.length} tổng cộng)`}
                  </div>
                  <StudentTable
                    students={displayStudents}
                    onClickAction={handleViewDetail}
                  />
                </div>
                <div className="w-1/3 bg-white p-6 rounded-lg shadow-md border">
                  {currentStudent ? (
                    <StudentDetail
                      student={currentStudent}
                      onEdit={() => console.log('Edit student')}
                      onDelete={() => {
                        console.log('Delete student');
                        setCurrentStudent(null);
                      }}
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      Chọn sinh viên để xem chi tiết
                    </div>
                  )}
                </div>
              </div>
              
              {showLoadMore && (
                <div className="mt-4 text-center">
                  <Button
                    type="primary"
                    onClick={handleLoadMore}
                    disabled={loading}
                    loading={loading}
                  >
                    {loading ? 'Đang tải...' : 'Xem thêm'}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default StudentList;