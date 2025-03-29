import {Button, Modal} from 'antd';
import React, { useState } from 'react';
import TeacherAddForm from './TeacherAddForm';

const TeacherAdd: React.FC = () => {
    const [open, setOpen] = useState(false);
    const handleAdd = () => {
        setOpen(true);
      };
    const handleImportCSV = () =>{

    }
    return (
        <>
            <Button type="default" onClick={handleImportCSV}  className="mb-4 bg-gray-100 hover:bg-gray-100 text-white border-none">
                Import CSV
            </Button>
            <Button type="primary" onClick={handleAdd}  className="mb-4 bg-primary-500 hover:bg-primary-600 text-white border-none">
                Thêm giáo viên
            </Button>

            <Modal
                title="Nhập thông tin cá nhân"
                open={open}
                onCancel={() => setOpen(false)}
                footer={null} // bạn có thể tùy chỉnh nút Save/Cancel trong form
                centered
            >
                <TeacherAddForm/>
            </Modal>
        </>
        
    );
};
export default TeacherAdd;