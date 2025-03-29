import { Input, Select, Row, Col } from 'antd';
import React from 'react';
import StudentAdd from './StudentAdd';

const { Option } = Select;

const StudentFilter: React.FC = () => {
  return (
    <>
        <StudentAdd/>
        <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={16}>
            <Input placeholder="Tìm kiếm theo tên hoặc email" />
        </Col>
        <Col span={8}>
            <Select defaultValue="" style={{ width: '100%' }}>
            <Option value="">Tất cả giới tính</Option>
            <Option value="male">Nam</Option>
            <Option value="female">Nữ</Option>
            </Select>
        </Col>
        </Row>
    </>
  );
};

export default StudentFilter;
