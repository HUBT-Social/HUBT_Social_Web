import { Button, Col, Input, Row } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getStudents, 
  selectStudents, 
  setFilter, 
  setStudentsFilters,
  clearStudents 
} from '../store/slices/studentSlice';
import { AppDispatch } from '../store/store';
import StudentAdd from './StudentAdd';

const StudentFilter: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const students = useSelector(selectStudents);

  const [searchTerm, setSearchTerm] = useState('');
  const [isEmptyResult, setIsEmptyResult] = useState(false);

  // Client-side filtering effect
  useEffect(() => {
    if (!searchTerm.trim()) {
      // No search term - show all students
      dispatch(setStudentsFilters(students));
      setIsEmptyResult(false);
      return;
    }

    // Filter students client-side
    const lowerSearch = searchTerm.toLowerCase();
    const filteredResults = students.filter(student => 
      student.userName?.toLowerCase().includes(lowerSearch) ||
      student.email?.toLowerCase().includes(lowerSearch) ||
      `${student.lastName} ${student.firstName}`.toLowerCase().includes(lowerSearch)
    );

    setIsEmptyResult(filteredResults.length === 0);
    dispatch(setStudentsFilters(filteredResults));
  }, [searchTerm, students, dispatch]);

  // Handle input change
  const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    dispatch(setFilter(value)); // Fix: Actually dispatch the setFilter action
  }, [dispatch]);

  // Handle client-side search (Enter key or search button)
  const handleClientSearch = useCallback(() => {
    // The filtering is already handled by the useEffect above
    // This function exists for consistency with the UI
  }, []);

  // Handle server-side search
  const handleServerSearch = useCallback(async () => {
    try {
      // Clear existing data and search on server
      dispatch(clearStudents());
      
      await dispatch(getStudents({
            searchTerm: searchTerm,
            page: 1,
            isLoadMore: false
      })).unwrap();
    } catch (error) {
      console.error('Server search failed:', error);
    }
  }, [dispatch, searchTerm]);

  return (
    <>
      <StudentAdd />
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={20}>
          <Input
            placeholder="Tìm theo Mã SV, Email, hoặc Họ tên"
            value={searchTerm}
            onChange={handleSearchInputChange}
            onPressEnter={handleClientSearch}
            allowClear
            onClear={() => setSearchTerm('')}
          />
        </Col>
        <Col span={4} className="flex items-center">
          <Button type="primary" onClick={handleClientSearch}>
            Tìm kiếm
          </Button>
        </Col>
      </Row>
      
      {isEmptyResult && searchTerm.trim() !== '' && (
        <Row style={{ marginBottom: 16 }}>
          <Col span={24}>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-800 mb-2">
                Không tìm thấy kết quả trong danh sách hiện tại ({students.length} sinh viên).
              </p>
              <Button type="default" onClick={handleServerSearch}>
                Tìm kiếm trên server
              </Button>
            </div>
          </Col>
        </Row>
      )}
    </>
  );
};

export default StudentFilter;