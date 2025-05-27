import React, { useState } from 'react';
import {
  Button,
  Card,
  Avatar,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  DatePicker,
  Tooltip,
  Upload,
  Spin,
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import {
  UserOutlined,
  MailOutlined,
  NotificationOutlined,
  MessageOutlined,
  UploadOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import {
  selectTeachers,
  setTeacher,
} from '../../../store/slices/teacherSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import dayjs from 'dayjs';
import { updatePasswordAsync, UpdatePasswordRequest } from '../../../services/userService/updatePassword';

const { Option } = Select;
const { TextArea } = Input;

// 👇 Giả lập API tạo phòng
const createChatRoomAPIAsync = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: { roomId: '12345' } });
    }, 1000);
  });
};

// 👇 Giả lập kết nối Hub SignalR
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
  const [form] = Form.useForm();
  const [passForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalUpPassVisible, setIsModalUpPassVisible] = useState(false);
  const teachers = useSelector(selectTeachers);
  const teacher = teachers.find((t) => t.userName === id);
  const dispatch = useDispatch<AppDispatch>();
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [isEmailOpen, setEmailOpen] = useState(false);
  const [imageData, setImageData] = useState<{ base64String: string; fileName: string } | null>(null);
  const [chatPopup_isVisible, setChatPopup_isVisible] = useState(false);
  const [chatPopup_isReadyToChat, setChatPopup_isReadyToChat] = useState(false);
  const [chatPopup_isConnecting, setChatPopup_isConnecting] = useState(false);

  const showEditModal = () => {
    if (!teacher) return;
    form.setFieldsValue({
      id: teacher.id,
      userName: teacher.userName,
      email: teacher.email,
      avataUrl: teacher.avataUrl,
      phoneNumber: teacher.phoneNumber,
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      fcmToken: teacher.fcmToken,
      status: teacher.status,
      gender: teacher.gender === 1 ? 'Male' : teacher.gender === 0 ? 'Female' : 'Other',
      dateOfBirth: teacher.dateOfBirth ? dayjs(teacher.dateOfBirth) : undefined,
    });
    setIsModalVisible(true);
  };

  const onFinish = async (values: any) => {
    const updatedTeacher = {
      ...teacher,
      ...values,
      gender: values.gender === 'Male' ? 1 : values.gender === 'Female' ? 0 : 2,
      dateOfBirth: values.dateOfBirth?.toISOString(),
    };
  
    try {
      const res = await dispatch(setTeacher(updatedTeacher));
  
      if (setTeacher.fulfilled.match(res)) {
        form.setFieldsValue({
          id: updatedTeacher.id,
          userName: updatedTeacher.userName,
          email: updatedTeacher.email,
          avataUrl: updatedTeacher.avataUrl,
          phoneNumber: updatedTeacher.phoneNumber,
          firstName: updatedTeacher.firstName,
          lastName: updatedTeacher.lastName,
          fcmToken: updatedTeacher.fcmToken,
          status: updatedTeacher.status,
          gender: updatedTeacher.gender === 1 ? 'Male' : updatedTeacher.gender === 0 ? 'Female' : 'Other',
          dateOfBirth: updatedTeacher.dateOfBirth ? dayjs(updatedTeacher.dateOfBirth) : undefined,
        });
        setIsModalVisible(false);
        alert("Cập nhật người dùng thành công!.");
        message.success('Cập nhật giáo viên thành công!');
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      alert("Cập nhật người dùng thất bại!.");
      setIsModalVisible(true);
      message.error('Cập nhật giáo viên thất bại!');
    }
  };
  

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const updatePassword = async (values: any) => {
    const request: UpdatePasswordRequest = {
      userName: teacher?.userName || '',  // Đảm bảo có userName
      newPassword: values.newPassword,
      confirmNewPassword: values.confirmPassword
    };
  
    try {
      const status = await updatePasswordAsync(request);
      if (status) {
        message.success("Cập nhật mật khẩu thành công!");
        setIsModalUpPassVisible(false);
        passForm.resetFields();
      } else {
        throw new Error();
      }
    } catch (error) {
      message.error("Cập nhật mật khẩu thất bại!");
    }
  };
  const handleBeforeUpload = (file: File) => {
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
    return false; // ngăn không cho Upload tự upload file
  };
  // Xử lý khi nhấn nút mở khung chat
  const handleChatPopup_OpenAsync = async () => {
    setChatPopup_isVisible(true);
    setChatPopup_isConnecting(true);

    try {
      const chatRoom_response = await createChatRoomAPIAsync();
      const chatRoom_id = (chatRoom_response as any).data.roomId;

      await connectToChatHubAsync(chatRoom_id);

      setChatPopup_isReadyToChat(true);
    } catch (err) {
      console.error('❌ Lỗi khi mở chat:', err);
    } finally {
      setChatPopup_isConnecting(false);
    }
  };

  if (!teacher) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <Card className="shadow-lg rounded-lg p-8">
          <p className="text-center text-lg text-gray-700">
            Không tìm thấy giáo viên với ID: {id}
          </p>
          <Button className="mt-4" onClick={() => navigate('/dashboard/teachers')}>
            Quay lại danh sách giáo viên
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <Card className="w-full mt-4 sm:mt-6 shadow-lg rounded-lg">
        <div className="flex flex-col md:flex-row md:space-x-8 p-4 sm:p-6">
          <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
            <Avatar
              size={150}
              src={teacher.avataUrl}
              icon={<UserOutlined />}
              className="border-2 border-blue-500 mb-4"
            />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {teacher.firstName} {teacher.lastName}
            </h2>
            <div className="flex justify-center gap-4 text-gray-600 mb-4">
              {/* Gửi thông báo */}
              {teacher.fcmToken  && (
                <Tooltip title="Gửi thông báo">
                <Button
                  shape="circle"
                  icon={<NotificationOutlined />}
                  onClick={() => setNotificationOpen(true)}
                />
              </Tooltip>
              )}

              {/* Gửi email */}
              {teacher.email && (
                  <Tooltip title="Gửi email">
                  <Button
                    shape="circle"
                    icon={<MailOutlined />}
                    onClick={() => setEmailOpen(true)}
                  />
                </Tooltip>
              )}
              

              {/* Nhắn tin */}
              <Tooltip title="Nhắn tin">
                <Button
                  shape="circle"
                  icon={<MessageOutlined />}
                  onClick={() => handleChatPopup_OpenAsync()}
                />
              </Tooltip>
            </div>

            {/* Modal gửi thông báo */}
            <Modal
              title="Gửi thông báo"
              open={isNotificationOpen}
              onCancel={() => setNotificationOpen(false)}
              onOk={() => {
                // TODO: xử lý gửi thông báo
                setNotificationOpen(false);
              }}
            >
              <Form form={form} layout="vertical">
                <Form.Item
                  label="Tiêu đề"
                  name="title"
                  rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                >
                  <Input placeholder="Nhập tiêu đề..." />
                </Form.Item>
                <Form.Item
                  label="Nội dung"
                  name="body"
                  rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                >
                  <TextArea rows={4} placeholder="Nhập nội dung..." />
                </Form.Item>
                <Form.Item label="Hình ảnh (nếu có)">
                  <Upload
                    beforeUpload={handleBeforeUpload}
                    maxCount={1}
                    showUploadList={{ showRemoveIcon: true }}
                    onRemove={() => setImageData(null)}
                  >
                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                  </Upload>
                </Form.Item>
              </Form>
            </Modal>

            {/* Modal gửi email */}
            <Modal
              title="Gửi Email"
              open={isEmailOpen}
              onCancel={() => setEmailOpen(false)}
              onOk={() => {
                // TODO: xử lý gửi email
                setEmailOpen(false);
              }}
            >
              <Form layout="vertical">
                <Form.Item label="Email người nhận">
                  <Input placeholder="abc@example.com" />
                </Form.Item>
                <Form.Item label="Tiêu đề">
                  <Input placeholder="Nhập tiêu đề..." />
                </Form.Item>
                <Form.Item label="Nội dung">
                  <TextArea rows={4} placeholder="Nhập nội dung..." />
                </Form.Item>
              </Form>
            </Modal>

             {/* Bong bóng chat cố định */}
              {chatPopup_isVisible && (
                <div className="fixed bottom-5 right-5 w-80 bg-white rounded-xl shadow-lg border p-4 z-50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-blue-600 text-lg">💬 Trò chuyện</span>
                    <Button
                      type="text"
                      size="small"
                      icon={<CloseOutlined />}
                      onClick={() => setChatPopup_isVisible(false)}
                    />
                  </div>

                  {chatPopup_isConnecting && (
                    <div className="text-center py-8 text-gray-500">
                      <Spin tip="Đang kết nối phòng chat..." />
                    </div>
                  )}

                  {!chatPopup_isConnecting && chatPopup_isReadyToChat && (
                    <>
                      <div className="h-48 overflow-y-auto space-y-2 mb-3 px-1 bg-gray-50 border rounded p-2">
                        <div className="text-sm text-gray-600">Bạn: Xin chào!</div>
                        <div className="text-sm text-blue-600 text-right">Hệ thống: Chào bạn!</div>
                      </div>

                      <Input.Search
                        placeholder="Nhập tin nhắn..."
                        enterButton="Gửi"
                        onSearch={(chatMessage_value) => {
                          // TODO: gửi chatMessage_value qua hub
                          console.log('📩 Gửi tin nhắn:', chatMessage_value);
                        }}
                      />
                    </>
                  )}
                </div>
              )}

          </div>

          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Thông tin chi tiết</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div><span className="font-medium text-gray-600">ID:</span><p>{teacher.id}</p></div>
              <div><span className="font-medium text-gray-600">Tên đăng nhập:</span><p>{teacher.userName}</p></div>
              <div><span className="font-medium text-gray-600">Email:</span><p>{teacher.email}</p></div>
              <div><span className="font-medium text-gray-600">Điện thoại:</span><p>{teacher.phoneNumber || 'N/A'}</p></div>
              <div><span className="font-medium text-gray-600">Giới tính:</span><p>{teacher.gender === 1 ? 'Nam' : teacher.gender === 0 ? 'Nữ' : 'Khác'}</p></div>
              <div><span className="font-medium text-gray-600">Ngày sinh:</span><p>{teacher.dateOfBirth ? new Date(teacher.dateOfBirth).toLocaleDateString() : 'N/A'}</p></div>
              <div><span className="font-medium text-gray-600">Trạng thái:</span><p>{teacher.status}</p></div>
            </div>
            <Space size="middle" className="flex justify-end">
              <Button onClick={() => navigate('/dashboard/teachers')}>Quay lại</Button>
              <Button type="primary" onClick={showEditModal}>Chỉnh sửa</Button>
              <Button type="primary" onClick={() => {
                  passForm.setFieldsValue({ userName: teacher.userName });
                  setIsModalUpPassVisible(true);
                }}>
                  Cập nhật mật khẩu
              </Button>
              <Button danger onClick={() => console.log('Delete teacher:', id)}>Xóa</Button>
            </Space>
          </div>
        </div>
      </Card>

      <Modal
        title="Chỉnh sửa thông tin giáo viên"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <div className="p-8 bg-white">

          <Form form={form} layout="vertical" onFinish={onFinish}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item label="ID" name="id"><Input disabled /></Form.Item>
              <Form.Item label="Tên đăng nhập" name="userName"><Input /></Form.Item>
              <Form.Item label="Tên" name="firstName" rules={[{ required: true, message: 'Vui lòng nhập tên giáo viên' }]}><Input /></Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item label="Họ" name="lastName" rules={[{ required: true, message: 'Vui lòng nhập họ giáo viên' }]}><Input /></Form.Item>
              <Form.Item label="Giới tính" name="gender" rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}> 
                <Select>
                  <Option value="Male">Nam</Option>
                  <Option value="Female">Nữ</Option>
                  <Option value="Other">Khác</Option>
                </Select>
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item label="Địa chỉ email" name="email" rules={[{ type: 'email', message: 'Email không hợp lệ' }, { required: false, message: 'Vui lòng nhập email' }]}><Input /></Form.Item>
              <Form.Item label="Số điện thoại" name="phoneNumber"><Input /></Form.Item>
            </div>
            <Form.Item label="Ngày sinh" name="dateOfBirth"><DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} /></Form.Item>

            <div className="flex justify-end mt-6">
              <Button onClick={handleCancel}>Hủy</Button>
              <Button type="primary" htmlType="submit" className="ml-4">Lưu</Button>
            </div>
          </Form>
        </div>
      </Modal>
      <Modal
  title="Cập nhật mật khẩu"
  open={isModalUpPassVisible}
  onCancel={() => {
    setIsModalUpPassVisible(false);
    passForm.resetFields();
  }}
  footer={null}
  width={400}
>
  <div className="p-8 bg-white">
  <Form
  form={passForm}
  layout="vertical"
  onFinish={updatePassword}
  initialValues={{ userName: teacher?.userName }}
>
  <Form.Item label="Tên đăng nhập" name="userName">
    <Input disabled />
  </Form.Item>

  <Form.Item
    label="Mật khẩu mới"
    name="newPassword"
    rules={[
      { required: true, message: 'Vui lòng nhập mật khẩu mới' },
      { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
    ]}
    hasFeedback
  >
    <Input.Password />
  </Form.Item>

  <Form.Item
    label="Xác nhận mật khẩu"
    name="confirmPassword"
    dependencies={['newPassword']}
    hasFeedback
    rules={[
      { required: true, message: 'Vui lòng xác nhận mật khẩu' },
      ({ getFieldValue }) => ({
        validator(_, value) {
          if (!value || getFieldValue('newPassword') === value) {
            return Promise.resolve();
          }
          return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
        },
      }),
    ]}
  >
    <Input.Password />
  </Form.Item>

  <div className="flex justify-end mt-4">
    <Button onClick={() => {
      setIsModalUpPassVisible(false);
      passForm.resetFields();
    }}>
      Hủy
    </Button>
    <Button type="primary" htmlType="submit" className="ml-4">
      Lưu
    </Button>
  </div>
</Form>
  </div>
</Modal>



    </div>
  );
};

export default TeacherDetail;
