import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectExamsError, selectExamsLoading, setExams } from '../../../store/slices/examSlice';
import { AppDispatch } from '../../../store/store';
import { Exam } from '../../../types/exams';
import Dashboard from './Dashboard';
import ExamList from './ExamList';
import Layout from './Layout';

const PracticeTestManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectExamsLoading);
  const error = useSelector(selectExamsError);

  // Example fake data to set
  const fakeExams: Exam[] = [
    {
      id: "1",
      title: "Đề thi Toán 2025",
      description: "Đề thi môn Toán dành cho học sinh lớp 12",
      fileName: "math_test_2025.pdf",
      major: "Toán",
      createdDate: "2025-06-01T10:00:00Z",
      status: "pending",
    },
    {
      id: "2",
      title: "Đề luyện Lý nâng cao",
      description: "Bài tập Lý nâng cao cho kỳ thi tốt nghiệp",
      fileName: "physics_advanced.pdf",
      major: "Lý",
      createdDate: "2025-06-02T14:30:00Z",
      status: "draft",
    },
  ];

  useEffect(() => {
    // Option 1: Fetch exams from API
    //dispatch(fetchExams({ page: 1, pageSize: 10, major: '' }));
    // Option 2: Set fake data (uncomment to use instead of fetch)
    dispatch(setExams(fakeExams));
  }, [dispatch]);

  return (
    <Layout>
      {loading && <div className="text-center p-8 text-xl">Đang tải...</div>}
      {error && <div className="text-red-600 text-center p-8 text-xl">{error}</div>}
      {!loading && !error && (
        <>
          <Dashboard />
          <ExamList />
        </>
      )}
    </Layout>
  );
};

export default PracticeTestManagement;