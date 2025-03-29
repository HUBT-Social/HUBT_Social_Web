import React, { useState } from 'react';
import { Card, Table } from 'antd';
import StudentEmpty from './StudentEmpty';
import { Student } from '../../../types/Student';
import StudentDetail from './StudentDetail';
import StudentFilter from '../../../components/StudentFilter';


const StudentList: React.FC = () => {
  const data: Student[] = [
    { id: '1', name: 'Nguyễn Văn A', email: 'a1@gmail.com', class: 'TH27.25', gender: 'Male' },
    { id: '2', name: 'Trần Thị B', email: 'b2@gmail.com', class: 'TH27.25', gender: 'Female' },
    { id: '3', name: 'Lê Văn C', email: 'c3@gmail.com', class: 'TH27.25', gender: 'Male' },
    { id: '4', name: 'Phạm Thị D', email: 'd4@gmail.com', class: 'TH27.25', gender: 'Female' },
    { id: '5', name: 'Hoàng Văn E', email: 'e5@gmail.com', class: 'TH27.25', gender: 'Male' },
    { id: '6', name: 'Đặng Thị F', email: 'f6@gmail.com', class: 'TH27.25', gender: 'Female' },
    { id: '7', name: 'Ngô Văn G', email: 'g7@gmail.com', class: 'TH27.25', gender: 'Male' },
    { id: '8', name: 'Vũ Thị H', email: 'h8@gmail.com', class: 'TH27.25', gender: 'Female' },
    { id: '9', name: 'Bùi Văn I', email: 'i9@gmail.com', class: 'TH27.25', gender: 'Male' },
    { id: '10', name: 'Dương Thị J', email: 'j10@gmail.com', class: 'TH27.25', gender: 'Female' },
    { id: '11', name: 'Trịnh Văn K', email: 'k11@gmail.com', class: 'TH27.25', gender: 'Male' },
    { id: '12', name: 'Lương Thị L', email: 'l12@gmail.com', class: 'TH27.25', gender: 'Female' },
    { id: '13', name: 'Tô Văn M', email: 'm13@gmail.com', class: 'TH27.25', gender: 'Male' },
    { id: '14', name: 'Mai Thị N', email: 'n14@gmail.com', class: 'TH27.25', gender: 'Female' },
    { id: '15', name: 'Châu Văn O', email: 'o15@gmail.com', class: 'TH27.25', gender: 'Male' },
    { id: '16', name: 'Lý Thị P', email: 'p16@gmail.com', class: 'TH27.25', gender: 'Female' },
    { id: '17', name: 'Đoàn Văn Q', email: 'q17@gmail.com', class: 'TH27.25', gender: 'Male' },
    { id: '18', name: 'Thái Thị R', email: 'r18@gmail.com', class: 'TH27.25', gender: 'Female' },
    { id: '19', name: 'Huỳnh Văn S', email: 's19@gmail.com', class: 'TH27.25', gender: 'Male' },
    { id: '20', name: 'Lâm Thị T', email: 't20@gmail.com', class: 'TH27.25', gender: 'Female' }, 
  ];
  const [currentStudent, setCurrentStudent] = useState<Student | null>(
    data.length === 0 ? null : data[0]
  );

  const handleViewDetail = (id: string) => {
    const currentStu = data.find(db => db.id === id);
    if (currentStu) {
      setCurrentStudent(currentStu);
      console.log('Selected student:', currentStudent);
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Student Id', dataIndex: 'id', key: 'id' },
    { title: 'Email Address', dataIndex: 'email', key: 'email' },
    { title: 'Class Name', dataIndex: 'class', key: 'class' },
    { title: 'Gender', dataIndex: 'gender', key: 'gender' },
  ];


    return (
        <>
        <Card title="Danh sách sinh viên">
          {data.length === 0 ? (
            <StudentEmpty />
          ) : (
            <div className="flex gap-6 p-4">
              <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
                <StudentFilter />
                <Table
                  columns={columns}
                  dataSource={data}
                  rowKey="id"
                  pagination={{ pageSize: 8 }}
                  onRow={(record) => ({
                    onClick: () => handleViewDetail(record.id), 
                  })}
                />
              </div>

              <div className="w-1/3 bg-white p-6 rounded-lg shadow-md">
                {currentStudent && (
                  <div className="mt-6">
                    <StudentDetail
                      id={currentStudent.id}
                      name={currentStudent.name}
                      email={currentStudent.email}
                      className={currentStudent.class}
                      gender={currentStudent.gender}
                      age={17} // bạn có thể thêm trường age nếu có
                      avatarUrl="https://randomuser.me/api/portraits/women/44.jpg"
                      onEdit={() => console.log('Sửa thông tin')}
                      onDelete={() => {
                        console.log('Đã xóa học sinh');
                        setCurrentStudent(null); // reset sau khi xóa
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>
        </>
    );
};

export default StudentList;