import { Button, Modal } from 'antd';
import { useState } from 'react';
import StudentAddForm from './StudentAddForm';

const StudentAdd: React.FC = () => {
    const [open, setOpen] = useState(false);
    const handleAdd = () => {
        setOpen(true);
      };
    return (
        <>
            <Button type="primary" onClick={handleAdd}  className="mb-4 bg-primary-500 hover:bg-primary-600 text-white border-none">
                Thêm sinh viên
            </Button>

            <Modal
                title="Nhập thông tin cá nhân"
                open={open}
                onCancel={() => setOpen(false)}
                footer={null} // bạn có thể tùy chỉnh nút Save/Cancel trong form
                centered
            >
                <StudentAddForm/>
            </Modal>
        </>
        
    );
};
export default StudentAdd;