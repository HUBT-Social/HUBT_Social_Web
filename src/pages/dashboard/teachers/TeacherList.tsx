
import React, { useEffect } from 'react';
import { Card, Spin, Table, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../../store/store';
import TeacherEmpty from './TeacherEmpty';
import { getTeachers, selectTeachers, selectTeachersLoading, selectTeachersError } from '../../../store/slices/teacherSlice';


const TeacherList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const teachers = useSelector(selectTeachers);
  const isLoading = useSelector(selectTeachersLoading);
  const error = useSelector(selectTeachersError);

  useEffect(() => {
    dispatch(getTeachers() as any); 
  }, [dispatch]);

  const handleViewDetail = (id: string) => {
    navigate(`/dashboard/teachers/${id}`);  
  };

  const columns = [
    {
      title: 'Tên giáo viên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Chức vụ',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: string[]) => (
        <>
          {roles.map((role) => (
            <Tag color="blue" key={role}>
              {role}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Môn giảng dạy',
      dataIndex: 'subjects',
      key: 'subjects',
      render: (subjects: string[]) => (
        <>
          {subjects.map((subject) => (
            <Tag color="green" key={subject}>
              {subject}
            </Tag>
          ))}
        </>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Card title="Danh sách giáo viên">
        <Spin tip="Đang tải..." />
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Danh sách giáo viên">
        <p>Lỗi khi tải danh sách giáo viên: {error}</p>
      </Card>
    );
  }
  

  return ( 
    <>      
        <Card title="Danh sách giáo viên" >
            {teachers.length === 0 ? (
              <TeacherEmpty />
            ) : (
              <Table columns={columns} dataSource={teachers} onRow={(record) => ({
                onClick: () => handleViewDetail(record.id), 
              })}/>
            )}  
        </Card>
    </>
    
   
  );
};

export default TeacherList;
