import { Button, Card, Form, message, Skeleton } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updatePasswordAsync, UpdatePasswordRequest } from '../../../services/userService/updatePassword';
import { selectTeachers, setTeacher } from '../../../store/slices/teacherSlice';
import { AppDispatch } from '../../../store/store';
import { UserInfo } from '../../../types/user';
import ChatPopup from './detail/ChatPopup';
import EditTeacherModal from './detail/EditTeacherModal';
import EmailModal from './detail/EmailModal';
import NotificationModal from './detail/NotificationModal';
import TeacherAvatar from './detail/TeacherAvatar';
import TeacherInfo from './detail/TeacherInfo';
import UpdatePasswordModal from './detail/UpdatePasswordModal';

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
  const teacher = teachers.find((t: { userName: string | undefined }) => t.userName === id);

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

  // Loading state
  const [isLoading,] = useState(!teacher);

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
      message.error('Không thể mở chat!');
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
    message.warning('Chức năng xóa đang được phát triển!');
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
      confirmNewPassword: values.confirmPassword,
    };
    try {
      const status = await updatePasswordAsync(request);
      if (status) {
        message.success('Cập nhật mật khẩu thành công!');
        setIsPasswordModalVisible(false);
        passwordForm.resetFields();
      } else {
        throw new Error();
      }
    } catch (error) {
      message.error('Cập nhật mật khẩu thất bại!');
    }
  };

  const handleNotificationSubmit = (values: any) => {
    console.log('Sending notification:', values);
    setIsNotificationModalVisible(false);
    message.success('Đã gửi thông báo!');
  };

  const handleEmailSubmit = (values: any) => {
    console.log('Sending email:', values);
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
    return false;
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

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  // Handle loading or not found
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4 sm:p-6 flex items-center justify-center">
        <Card className="w-full max-w-2xl shadow-xl rounded-2xl p-8">
          <Skeleton avatar paragraph={{ rows: 4 }} active />
        </Card>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4 sm:p-6 flex items-center justify-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="w-full max-w-md"
        >
          <Card className="shadow-xl rounded-2xl p-8 text-center bg-white">
            <p className="text-lg font-medium text-gray-700 mb-6">
              Không tìm thấy giáo viên với ID: {id}
            </p>
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Button
                type="primary"
                size="large"
                className="bg-gradient-to-r from-blue-500 to-blue-600 border-none"
                onClick={handleBack}
              >
                Quay lại danh sách giáo viên
              </Button>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4 sm:p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="w-full max-w-7xl mx-auto"
      >
        <Card className="shadow-xl rounded-2xl overflow-hidden bg-white">
          <div className="flex flex-col lg:flex-row lg:space-x-8 p-6 sm:p-8">
            {/* Avatar Section */}
            <motion.div
              className="w-full lg:w-1/3 mb-6 lg:mb-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <TeacherAvatar
                teacher={teacher}
                onSendNotification={handleSendNotification}
                onSendEmail={handleSendEmail}
                onOpenChat={handleOpenChat}
              />
            </motion.div>

            {/* Info Section */}
            <motion.div
              className="w-full lg:w-2/3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <TeacherInfo
                teacher={teacher}
                onEdit={handleEdit}
                onUpdatePassword={handleUpdatePassword}
                onDelete={handleDelete}
                onBack={handleBack}
              />
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {isEditModalVisible && (
          <EditTeacherModal
            visible={isEditModalVisible}
            teacher={teacher}
            form={editForm}
            onSubmit={handleEditSubmit}
            onCancel={handleEditCancel}
          />
        )}
        {isPasswordModalVisible && (
          <UpdatePasswordModal
            visible={isPasswordModalVisible}
            userName={teacher.userName}
            form={passwordForm}
            onSubmit={handlePasswordSubmit}
            onCancel={handlePasswordCancel}
          />
        )}
        {isNotificationModalVisible && (
          <NotificationModal
            visible={isNotificationModalVisible}
            onSubmit={handleNotificationSubmit}
            onCancel={handleNotificationCancel}
            onImageUpload={handleImageUpload}
            onImageRemove={handleImageRemove}
          />
        )}
        {isEmailModalVisible && (
          <EmailModal
            visible={isEmailModalVisible}
            recipientEmail={teacher.email}
            onSubmit={handleEmailSubmit}
            onCancel={handleEmailCancel}
          />
        )}
      </AnimatePresence>

      {/* Chat Popup */}
      <AnimatePresence>
        {chatVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <ChatPopup
              visible={chatVisible}
              isConnecting={chatConnecting}
              isReadyToChat={chatReady}
              onClose={handleChatClose}
              onSendMessage={handleSendMessage}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherDetail;