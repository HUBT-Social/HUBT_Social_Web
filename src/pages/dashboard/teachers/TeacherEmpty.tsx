  // teacher/TeacherEmpty.tsx
  import React from 'react';
  import { Empty, Button } from 'antd';

  const TeacherEmpty: React.FC = () => {
    return (
      <div style={{ textAlign: 'center', paddingTop: 100 }}>
        <Empty description="No Teacher">
          <Button type="primary"></Button>
        </Empty>
      </div>
    );
  };

  export default TeacherEmpty;
