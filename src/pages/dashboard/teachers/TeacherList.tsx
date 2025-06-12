import { Button, Card, Spin, message } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, RefreshCw } from 'lucide-react';
import type { AppDispatch } from '../../../store/store';
import {
  getTeachers,
  selectTeachers,
  selectTeachersError,
  selectTeachersLoading,
  selectHasMore,
  clearTeachers,
  selectTeachersFilters,
} from '../../../store/slices/teacherSlice';
import TeacherEmpty from './TeacherEmpty';
import TeacherTable from './TeacherTable';

const TeacherList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Selectors
  const error = useSelector(selectTeachersError);
  const loading = useSelector(selectTeachersLoading);
  const hasMore = useSelector(selectHasMore);
  const currentFilter = useSelector(selectTeachersFilters);
  const teachers = useSelector(selectTeachers);

  // Local state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const hasFetchedInitial = useRef(false);

  // Load teachers for a specific page
  const loadTeachersPage = async (page: number) => {
    try {
      console.log(`📄 Loading page ${page} with size ${pageSize}...`);
      await dispatch(
        getTeachers({ params: { page, pageSize }, currentFilter })
      ).unwrap();
    } catch (err: any) {
      console.error(`❌ Error loading page ${page}:`, err);
      message.error(err?.message || 'Không thể tải danh sách giáo viên');
    }
  };

  // Load data only if necessary
  useEffect(() => {
    // Only load if no teachers data or initial fetch hasn't happened
    if (!hasFetchedInitial.current && !loading && !error && teachers.length === 0) {
      hasFetchedInitial.current = true;
      loadTeachersPage(1);
    }
  }, [loading, error, teachers.length]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (!hasMore || loading) return;
    const nextPage = currentPage + 1;
    console.log(`🔄 Loading more: page ${nextPage}`);
    setCurrentPage(nextPage);
    loadTeachersPage(nextPage);
  }, [currentPage, hasMore, loading]);

  // Handle reload
  const handleReload = useCallback(() => {
    console.log('🔄 Reloading...');
    dispatch(clearTeachers());
    setCurrentPage(1);
    hasFetchedInitial.current = false; // Reset to allow fetching again
    loadTeachersPage(1);
  }, [dispatch]);

  // Handle export
  const handleExport = useCallback(() => {
    message.info('Chức năng xuất Excel đang được phát triển...');
  }, []);

  // Handle view detail
  const handleViewDetail = useCallback(
    (userName: string) => {
      navigate(`/dashboard/teachers/${userName}`);
    },
    [navigate]
  );

  // Render extra buttons
  const renderExtra = () => (
    <div className="flex gap-2">
      <Button icon={<RefreshCw className="w-4 h-4" />} onClick={handleReload} disabled={loading}>
        {loading ? 'Đang tải...' : 'Reload'}
      </Button>
      <Button
        type="primary"
        onClick={handleExport}
        disabled={teachers.length === 0}
      >
        Xuất Excel
      </Button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-6">
      <Card
        title={
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Danh sách giáo viên</h2>
            {renderExtra()}
          </div>
        }
        className="shadow-sm rounded-lg"
      >
        <div className="min-h-[400px] relative">
          {loading ? (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-lg">
              <div className="text-center">
                <Spin size="large" />
                <p className="mt-4 text-gray-600 font-medium">Đang tải trang {currentPage}...</p>
                <p className="text-sm text-gray-500">Vui lòng đợi...</p>
              </div>
            </div>
          ) : null}

          {error && !loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
              <p className="text-gray-600 mb-6 text-center max-w-md">{error}</p>
              <Button type="primary" size="large" onClick={handleReload}>
                Thử lại
              </Button>
            </div>
          ) : teachers.length === 0 && !loading ? (
            <TeacherEmpty />
          ) : (
            <>
              <TeacherTable
                teachers={teachers}
                onClickAction={handleViewDetail}
              />
              {hasMore && (
                <div className="mt-4 text-center">
                  <Button
                    type="primary"
                    onClick={handleLoadMore}
                    disabled={loading}
                  >
                    Xem thêm
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

export default TeacherList;