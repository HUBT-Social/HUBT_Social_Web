import React, { useState } from 'react';
import { Card, Form, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { selectTeachers, setTeacher } from '../../../store/slices/teacherSlice';
import { updatePasswordAsync, UpdatePasswordRequest } from '../../../services/userService/updatePassword';
import TeacherAvatar from './detail/TeacherAvatar';
import TeacherInfo from './detail/TeacherInfo';
import EditTeacherModal from './detail/EditTeacherModal';
import UpdatePasswordModal from './detail/UpdatePasswordModal';
import NotificationModal from './detail/NotificationModal';
import EmailModal from './detail/EmailModal';
import ChatPopup from './detail/ChatPopup';
import { UserInfo } from '../../../types/User';



// API giả lập
const createChatRoomAPIAsync = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: { roomId: '12345' } });
    }, 1000);
  });
};

const connectToChatHubAsync = async (roomId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Connected to Hub with Room:', roomId);
      resolve(true);
    }, 1000);
  });
};

const TeacherDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  // Forms
  const [editForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  
  // Redux
  const teachers = useSelector(selectTeachers);
  const teacher = teachers.find((t) => t.userName === id);
  
  // Modal states
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isNotificationModalVisible, setIsNotificationModalVisible] = useState(false);
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
  
  // Chat states
  const [chatVisible, setChatVisible] = useState(false);
  const [chatConnecting, setChatConnecting] = useState(false);
  const [chatReady, setChatReady] = useState(false);
  
  // Upload state
  const [, setImageData] = useState<{ base64String: string; fileName: string } | null>(null);

  // Handlers for TeacherAvatar
  const handleSendNotification = () => {
    setIsNotificationModalVisible(true);
  };

  const handleSendEmail = () => {
    setIsEmailModalVisible(true);
  };

  const handleOpenChat = async () => {
    setChatVisible(true);
    setChatConnecting(true);

    try {
      const chatRoom_response = await createChatRoomAPIAsync();
      const chatRoom_id = (chatRoom_response as any).data.roomId;
      await connectToChatHubAsync(chatRoom_id);
      setChatReady(true);
    } catch (err) {
      console.error('❌ Lỗi khi mở chat:', err);
    } finally {
      setChatConnecting(false);
    }
  };

  // Handlers for TeacherInfo
  const handleEdit = () => {
    setIsEditModalVisible(true);
  };

  const handleUpdatePassword = () => {
    setIsPasswordModalVisible(true);
  };

  const handleDelete = () => {
    console.log('Delete teacher:', id);
    // TODO: Implement delete functionality
  };

  const handleBack = () => {
    navigate('/dashboard/teachers');
  };

  // Form submissions
  const handleEditSubmit = async (values: any) => {
    if (!teacher) return;

    const updatedTeacher: UserInfo = {
      ...teacher,
      ...values,
      gender: values.gender === 'Male' ? 1 : values.gender === 'Female' ? 0 : 2,
      dateOfBirth: values.dateOfBirth?.toISOString(),
    };

    try {
      const res = await dispatch(setTeacher(updatedTeacher));

      if (setTeacher.fulfilled.match(res)) {
        setIsEditModalVisible(false);
        message.success('Cập nhật giáo viên thành công!');
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      message.error('Cập nhật giáo viên thất bại!');
    }
  };

  const handlePasswordSubmit = async (values: any) => {
    if (!teacher) return;

    const request: UpdatePasswordRequest = {
      userName: teacher.userName,
      newPassword: values.newPassword,
      confirmNewPassword: values.confirmPassword
    };

    try {
      const status = await updatePasswordAsync(request);
      if (status) {
        message.success("Cập nhật mật khẩu thành công!");
        setIsPasswordModalVisible(false);
        passwordForm.resetFields();
      } else {
        throw new Error();
      }
    } catch (error) {
      message.error("Cập nhật mật khẩu thất bại!");
    }
  };

  const handleNotificationSubmit = (values: any) => {
    console.log('Sending notification:', values);
    // TODO: Implement notification sending
    setIsNotificationModalVisible(false);
    message.success('Đã gửi thông báo!');
  };

  const handleEmailSubmit = (values: any) => {
    console.log('Sending email:', values);
    // TODO: Implement email sending
    setIsEmailModalVisible(false);
    message.success('Đã gửi email!');
  };

  // Image upload handler
  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageData({
        base64String: reader.result as string,
        fileName: file.name,
      });
    };
    reader.onerror = () => {
      message.error('Không thể đọc file ảnh!');
    };
    reader.readAsDataURL(file);
    return false; // Prevent auto upload
  };

  const handleImageRemove = () => {
    setImageData(null);
  };

  // Chat handlers
  const handleChatClose = () => {
    setChatVisible(false);
    setChatReady(false);
  };

  const handleSendMessage = (message: string) => {
    console.log('📩 Gửi tin nhắn:', message);
    // TODO: Implement message sending via SignalR
  };

  // Modal cancel handlers
  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    editForm.resetFields();
  };

  const handlePasswordCancel = () => {
    setIsPasswordModalVisible(false);
    passwordForm.resetFields();
  };

  const handleNotificationCancel = () => {
    setIsNotificationModalVisible(false);
  };

  const handleEmailCancel = () => {
    setIsEmailModalVisible(false);
  };

  // Loading state when teacher not found
  if (!teacher) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <Card className="shadow-lg rounded-lg p-8 text-center">
          <p className="text-lg text-gray-700 mb-4">
            Không tìm thấy giáo viên với ID: {id}
          </p>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleBack}
          >
            Quay lại danh sách giáo viên
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <Card className="w-full mt-4 sm:mt-6 shadow-lg rounded-lg">
        <div className="flex flex-col md:flex-row md:space-x-8 p-4 sm:p-6">
          {/* Avatar Section */}
          <TeacherAvatar
            teacher={teacher}
            onSendNotification={handleSendNotification}
            onSendEmail={handleSendEmail}
            onOpenChat={handleOpenChat}
          />

          {/* Info Section */}
          <TeacherInfo
            teacher={teacher}
            onEdit={handleEdit}
            onUpdatePassword={handleUpdatePassword}
            onDelete={handleDelete}
            onBack={handleBack}
          />
        </div>
      </Card>

      {/* Edit Modal */}
      <EditTeacherModal
        visible={isEditModalVisible}
        teacher={teacher}
        form={editForm}
        onSubmit={handleEditSubmit}
        onCancel={handleEditCancel}
      />

      {/* Password Modal */}
      <UpdatePasswordModal
        visible={isPasswordModalVisible}
        userName={teacher.userName}
        form={passwordForm}
        onSubmit={handlePasswordSubmit}
        onCancel={handlePasswordCancel}
      />

      {/* Notification Modal */}
      <NotificationModal
        visible={isNotificationModalVisible}
        onSubmit={handleNotificationSubmit}
        onCancel={handleNotificationCancel}
        onImageUpload={handleImageUpload}
        onImageRemove={handleImageRemove}
      />

      {/* Email Modal */}
      <EmailModal
        visible={isEmailModalVisible}
        recipientEmail={teacher.email}
        onSubmit={handleEmailSubmit}
        onCancel={handleEmailCancel}
      />

      {/* Chat Popup */}
      <ChatPopup
        visible={chatVisible}
        isConnecting={chatConnecting}
        isReadyToChat={chatReady}
        onClose={handleChatClose}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default TeacherDetail;