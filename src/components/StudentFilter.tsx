import { Input, Select, Row, Col, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import StudentAdd from './StudentAdd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store/store';
import { selectStudents, setFilteredStudents } from '../store/slices/studentSlice';

const { Option } = Select;

const StudentFilter: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const students = useSelector(selectStudents);

  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<number | null>(-1);
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    applyFilters();
  }, [searchTerm, genderFilter, statusFilter, students]);

  const applyFilters = () => {
    let results = [...students];

    // Tìm theo mã SV, họ tên, email, lớp
    if (searchTerm.trim() !== '') {
      const lowerSearch = searchTerm.toLowerCase();
      results = results.filter(student =>
        student.userName?.toLowerCase().includes(lowerSearch) ||
        `${student.lastName} ${student.firstName}`.toLowerCase().includes(lowerSearch) ||
        student.email?.toLowerCase().includes(lowerSearch) ||
        student.className?.toLowerCase().includes(lowerSearch)
      );
    }

    // Giới tính
    if (genderFilter !== null && genderFilter !== -1) {
      results = results.filter(student => student.gender === genderFilter);
    }

    // Trạng thái
    if (statusFilter !== '') {
      results = results.filter(student => student.status === statusFilter);
    }

    dispatch(setFilteredStudents(results));
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleGenderSelectChange = (gender: number) => {
    setGenderFilter(gender);
  };

  const handleStatusSelectChange = (status: string) => {
    setStatusFilter(status);
  };

  const handleSearch = () => {
    applyFilters();
  };

  return (
    <>
      <StudentAdd />
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Input
            placeholder="Tìm theo Mã SV, Họ tên, Email, Lớp"
            value={searchTerm}
            onChange={handleSearchInputChange}
            onPressEnter={handleSearch}
          />
        </Col>
        <Col span={6}>
          <Select
            value={genderFilter}
            onChange={handleGenderSelectChange}
            style={{ width: '100%' }}
          >
            <Option value={-1}>Tất cả giới tính</Option>
            <Option value={1}>Nam</Option>
            <Option value={2}>Nữ</Option>
            <Option value={0}>Khác</Option>
          </Select>
        </Col>
        <Col span={6}>
          <Select
            value={statusFilter}
            onChange={handleStatusSelectChange}
            style={{ width: '100%' }}
          >
            <Option value="">Tất cả trạng thái</Option>
            <Option value="Active">Hoạt động</Option>
            <Option value="Inactive">Không hoạt động</Option>
            <Option value="Pending">Đang chờ</Option>
          </Select>
        </Col>
        <Col span={4} className="flex items-center">
          <Button type="primary" onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default StudentFilter;
