import { Input, Select, Row, Col, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import TeacherAdd from '../components/TeacherAdd';
import { UserInfo } from '../types/User';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store/store';
import { selectTeachers, setFilteredTeachers } from '../store/slices/teacherSlice';

const { Option } = Select;

const TeacherFilter: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const teachers = useSelector(selectTeachers);

  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<number | null>(-1);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const [filteredTeachers, setfilteredTeachers] = useState<UserInfo[]>(teachers);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, genderFilter, statusFilter, teachers]);

  const applyFilters = () => {
    let results = [...teachers];

    // Search
    if (searchTerm.trim() !== '') {
      results = results.filter(teacher =>
        (teacher.firstName + ' ' + teacher.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.userName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Gender
    if (genderFilter !== null && genderFilter !== -1) {
      results = results.filter(teacher => teacher.gender === genderFilter);
    }

    // Status
    if (statusFilter !== '') {
      results = results.filter(teacher => teacher.status === statusFilter);
    }

    setfilteredTeachers(results);
    dispatch(setFilteredTeachers(results));
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
    applyFilters(); // có thể giữ lại nếu cần tìm bằng nút "Tìm kiếm"
  };

  return (
    <>
      <TeacherAdd />
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Input
            placeholder="Tìm kiếm theo tên hoặc email"
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

export default TeacherFilter;
