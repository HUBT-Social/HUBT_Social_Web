import React from 'react';
import { Button, Empty } from 'antd';

const StudentEmpty: React.FC = () => {

    return (
        <>
            <div style={{ textAlign: 'center', paddingTop: 100 }}>
                <Empty description="No Teacher">
                    <Button type="primary"></Button>
                </Empty>
            </div>
        </>
    );
};

export default StudentEmpty;