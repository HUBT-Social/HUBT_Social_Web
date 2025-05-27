import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Input,
  Select,
  Upload,
  Button,
  Modal,
  Radio,
  Alert,
} from 'antd';
import {
  UploadOutlined,
  EyeOutlined,
  SendOutlined,
  UserOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { NotificationPayload, NotificationType ,sendNotification} from '../../../store/slices/notificationSlice';
import { useSelector , useDispatch} from 'react-redux';
import { selectStudents} from '../../../store/slices/studentSlice';
import { selectTeachers} from '../../../store/slices/teacherSlice';
import { selectToken} from '../../../store/slices/authSlice';
import { AppDispatch } from '../../../store/store';




const notificationTypeOptions = [
  { value: NotificationType.Default, label: 'Default', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  { value: NotificationType.Event, label: 'Event', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { value: NotificationType.Warning, label: 'Warning', color: 'text-red-600', bgColor: 'bg-red-100' },
  { value: NotificationType.Announcement, label: 'Announcement', color: 'text-green-600', bgColor: 'bg-green-100' },
  { value: NotificationType.Reminder, label: 'Reminder', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  { value: NotificationType.Urgent, label: 'Urgent', color: 'text-purple-600', bgColor: 'bg-purple-100' },
];

const NotificationSender = () => {
  // Form state
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageFile, setImageFile] = useState<any>(null);
  const [requestId, setRequestId] = useState('');
  const [type, setType] = useState(NotificationType.Default);
  const [recipientType, setRecipientType] = useState('all');
  const [facultyCodes, setFacultyCodes] = useState<string[]>([]);
  const [courseCodes, setCourseCodes] = useState<string[]>([]);
  const [classCodes, setClassCodes] = useState<string[]>([]);
  const [userNames, setUserNames] = useState<string[]>([]);
  const students = useSelector(selectStudents);
  const teachers = useSelector(selectTeachers);
  
  
  // UI state
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [notification, setNotification] = useState<any>(null);

  const dispatch = useDispatch<AppDispatch>();

  // Mock data
  const users = useMemo(() => [...students, ...teachers], []);
  const token = useSelector(selectToken)?.accessToken;

  // Extract faculties from class names
  const faculties = useMemo(() => {
    const facultiesSet = new Set();
    users.forEach(user => {
      if (user.className) {
        const facultyMatch = user.className.match(/^([A-Z]+)/);
        if (facultyMatch) facultiesSet.add(facultyMatch[1]);
      }
    });
    return Array.from(facultiesSet).sort();
  }, [users]);

  // Extract courses based on selected faculties
  const availableCourses = useMemo(() => {
    if (!facultyCodes.length) {
      const coursesSet = new Set();
      users.forEach(user => {
        if (user.className) {
          const courseMatch = user.className.match(/[A-Z]+(\d+)/);
          if (courseMatch) coursesSet.add(courseMatch[1]);
        }
      });
      return Array.from(coursesSet).sort();
    }

    const coursesSet = new Set();
    users.forEach(user => {
      if (user.className) {
        const facultyMatch = user.className.match(/^([A-Z]+)/);
        const courseMatch = user.className.match(/[A-Z]+(\d+)/);
        const faculty = facultyMatch ? facultyMatch[1] : '';
        if (facultyCodes.includes(faculty) && courseMatch) {
          coursesSet.add(courseMatch[1]);
        }
      }
    });
    return Array.from(coursesSet).sort();
  }, [users, facultyCodes]);

  // Extract classes based on selected faculties and courses
  const availableClasses = useMemo(() => {
    if (!facultyCodes.length && !courseCodes.length) {
      const classesSet = new Set();
      users.forEach(user => {
        if (user.className) classesSet.add(user.className);
      });
      return Array.from(classesSet).sort();
    }

    const classesSet = new Set();
    users.forEach(user => {
      if (user.className) {
        const facultyMatch = user.className.match(/^([A-Z]+)/);
        const courseMatch = user.className.match(/[A-Z]+(\d+)/);
        const faculty = facultyMatch ? facultyMatch[1] : '';
        const course = courseMatch ? courseMatch[1] : '';
        const matchesFaculty = !facultyCodes.length || facultyCodes.includes(faculty);
        const matchesCourse = !courseCodes.length || courseCodes.includes(course);
        if (matchesFaculty && matchesCourse) {
          classesSet.add(user.className);
        }
      }
    });
    return Array.from(classesSet).sort();
  }, [users, facultyCodes, courseCodes]);

  // Extract usernames based on all filters
  const availableUserNames = useMemo(() => {
    if (!facultyCodes.length && !courseCodes.length && !classCodes.length) {
      return users.map(user => user.userName).sort();
    }

    const userNamesSet = new Set();
    users.forEach(user => {
      if (user.className) {
        const facultyMatch = user.className.match(/^([A-Z]+)/);
        const courseMatch = user.className.match(/[A-Z]+(\d+)/);
        const faculty = facultyMatch ? facultyMatch[1] : '';
        const course = courseMatch ? courseMatch[1] : '';
        const matchesFaculty = !facultyCodes.length || facultyCodes.includes(faculty);
        const matchesCourse = !courseCodes.length || courseCodes.includes(course);
        const matchesClass = !classCodes.length || classCodes.includes(user.className);
        if (matchesFaculty && matchesCourse && matchesClass) {
          userNamesSet.add(user.userName);
        }
      } else if (!facultyCodes.length && !courseCodes.length && !classCodes.length) {
        userNamesSet.add(user.userName);
      }
    });
    return Array.from(userNamesSet).sort();
  }, [users, facultyCodes, courseCodes, classCodes]);

  // Filter users based on current selection
  const filteredUsers = useMemo(() => {
    if (recipientType === 'all') return users;

    return users.filter(user => {
      if (!user.className) return userNames.includes(user.userName);

      const facultyMatch = user.className.match(/^([A-Z]+)/);
      const courseMatch = user.className.match(/[A-Z]+(\d+)/);
      const faculty = facultyMatch ? facultyMatch[1] : '';
      const course = courseMatch ? courseMatch[1] : '';

      const matchesFaculty = !facultyCodes.length || facultyCodes.includes(faculty);
      const matchesCourse = !courseCodes.length || courseCodes.includes(course);
      const matchesClass = !classCodes.length || classCodes.includes(user.className);
      const matchesUserName = !userNames.length || userNames.includes(user.userName);

      return matchesFaculty && matchesCourse && matchesClass && matchesUserName;
    });
  }, [users, recipientType, facultyCodes, courseCodes, classCodes, userNames]);

  // Reset dependent selections when parent selections change
  useEffect(() => {
    if (facultyCodes.length) {
      const validCourseCodes = courseCodes.filter(code => availableCourses.includes(code));
      if (validCourseCodes.length !== courseCodes.length) {
        setCourseCodes(validCourseCodes);
      }
      const validClassCodes = classCodes.filter(code => availableClasses.includes(code));
      if (validClassCodes.length !== classCodes.length) {
        setClassCodes(validClassCodes);
      }
      const validUserNames = userNames.filter(name => availableUserNames.includes(name));
      if (validUserNames.length !== userNames.length) {
        setUserNames(validUserNames);
      }
    }
  }, [facultyCodes, availableCourses, availableClasses, availableUserNames, courseCodes, classCodes, userNames]);

  useEffect(() => {
    if (courseCodes.length) {
      const validClassCodes = classCodes.filter(code => availableClasses.includes(code));
      if (validClassCodes.length !== classCodes.length) {
        setClassCodes(validClassCodes);
      }
      const validUserNames = userNames.filter(name => availableUserNames.includes(name));
      if (validUserNames.length !== userNames.length) {
        setUserNames(validUserNames);
      }
    }
  }, [courseCodes, availableClasses, availableUserNames, classCodes, userNames]);

  useEffect(() => {
    if (classCodes.length) {
      const validUserNames = userNames.filter(name => availableUserNames.includes(name));
      if (validUserNames.length !== userNames.length) {
        setUserNames(validUserNames);
      }
    }
  }, [classCodes, availableUserNames, userNames]);

  const handleImageUpload = useCallback((event: { target: { files: any[]; }; }) => {
    const file = event.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      setErrors((prev: any) => ({ ...prev, image: 'Only image files are allowed!' }));
      return;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      setErrors((prev: any) => ({ ...prev, image: 'Image must be smaller than 2MB!' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageFile({
        file: e.target?.result,
        fileName: file.name,
        previewUrl: e.target?.result
      });
      setErrors((prev: any) => ({ ...prev, image: undefined }));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDragOver = useCallback((e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: { preventDefault: () => void; dataTransfer: { files: Iterable<unknown> | ArrayLike<unknown>; }; }) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      const fakeEvent = { target: { files: [file] } };
      handleImageUpload(fakeEvent);
    }
  }, [handleImageUpload]);

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!body.trim()) {
      newErrors.body = 'Content is required';
    }
    
    if (recipientType === 'specific' && 
        !facultyCodes.length && 
        !courseCodes.length && 
        !classCodes.length && 
        !userNames.length) {
      newErrors.recipients = 'Please select at least one recipient criteria';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
  if (!validateForm()) return;

  const payload: NotificationPayload = {
    title,
    body,
    image: imageFile?.file
      ? { base64String: imageFile.file, fileName: imageFile.fileName }
      : null,
    type,
    facultyCodes,
    courseCodes,
    classCodes,
    userNames,
    sendAll: recipientType === 'all',
  };

  console.log('Payload:', payload);

  if (!token) {
    setNotification({
      type: 'error',
      message: 'Bạn chưa đăng nhập. Vui lòng đăng nhập để gửi thông báo.',
    });
    return;
  }

  setIsLoading(true);

  try {
    // Gửi thông báo
    await dispatch(sendNotification({ payload, token }));

    setNotification({
      type: 'success',
      message: 'Gửi thông báo thành công!',
    });

    // Reset form
    setTitle('');
    setBody('');
    setImageFile(null);
    setRequestId('');
    setType(NotificationType.Default);
    setRecipientType('all');
    setFacultyCodes([]);
    setCourseCodes([]);
    setClassCodes([]);
    setUserNames([]);
    setErrors({});
  } catch (error) {
    console.error(error);
    setNotification({
      type: 'error',
      message: 'Đã xảy ra lỗi khi gửi thông báo.',
    });
  } finally {
    setIsLoading(false);
    setTimeout(() => setNotification(null), 3000);
  }
};
  const handlePreview = () => {
    if (title || body || imageFile) {
      setIsPreviewVisible(true);
    } else {
      setNotification({
        type: 'info',
        message: 'Please enter title, content, or select an image to preview!'
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const currentNotificationType = notificationTypeOptions.find(t => t.value === type);

  return (
    <div className="min-h-screen bg-white ">
      {/* Notification */}
      {notification && (
        <Alert
          message={notification.message}
          type={notification.type}
          showIcon
          icon={
            notification.type === 'success' ? <CheckCircleOutlined /> :
            notification.type === 'error' ? <ExclamationCircleOutlined /> :
            <InfoCircleOutlined />
          }
          className="fixed top-4 right-4 z-50 max-w-sm"
          closable
          onClose={() => setNotification(null)}
        />
      )}

      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-x2 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
          <SendOutlined className="mr-3 text-blue-600" />
          Send Notification
        </h1>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Basic Info */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title *
              </label>
              <Input
                placeholder="Enter notification title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                status={errors.title ? 'error' : ''}
                disabled={isLoading}
                className="rounded-lg"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Content *
              </label>
              <Input.TextArea
                placeholder="Enter notification content"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
                status={errors.body ? 'error' : ''}
                disabled={isLoading}
                className="rounded-lg"
              />
              {errors.body && (
                <p className="text-red-500 text-xs mt-1">{errors.body}</p>
              )}
            </div>

            {/* Notification Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Notification Type
              </label>
              <Select
                value={type}
                onChange={setType}
                options={notificationTypeOptions}
                disabled={isLoading}
                className="w-full"
              />
            </div>

            {/* Request ID */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Request ID (Optional)
              </label>
              <Input
                placeholder="Enter request ID"
                value={requestId}
                onChange={(e) => setRequestId(e.target.value)}
                disabled={isLoading}
                className="rounded-lg"
              />
            </div>
          </div>

          {/* Right Column - Image Upload */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Image (Optional)
              </label>
              {imageFile ? (
                <div className="relative">
                  <img
                    src={imageFile.previewUrl}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                  <Button
                    icon={<CloseOutlined />}
                    shape="circle"
                    onClick={() => setImageFile(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white border-none hover:bg-red-600"
                  />
                </div>
              ) : (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <UploadOutlined className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Drag & drop an image here, or</p>
                  <Upload
                    accept="image/*"
                    showUploadList={false}
                    customRequest={({ file }) => {
                      const fakeEvent = { target: { files: [file] } };
                      handleImageUpload(fakeEvent);
                    }}
                    disabled={isLoading}
                  >
                    <Button
                      icon={<UploadOutlined />}
                      className="bg-blue-500 text-white border-none hover:bg-blue-600"
                    >
                      Choose File
                    </Button>
                  </Upload>
                  <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 2MB</p>
                </div>
              )}
              {errors.image && (
                <p className="text-red-500 text-xs mt-1">{errors.image}</p>
              )}
            </div>
          </div>
        </div>

        {/* Recipients Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <UserOutlined className="mr-2" />
            Recipients
          </h3>
          
          <div className="space-y-4">
            <Radio.Group
              value={recipientType}
              onChange={(e) => setRecipientType(e.target.value)}
              disabled={isLoading}
              className="flex space-x-4"
            >
              <Radio value="all">Send to entire school</Radio>
              <Radio value="specific">Send to specific recipients</Radio>
            </Radio.Group>

            {recipientType === 'specific' && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Faculties
                  </label>
                  <Select
                    mode="multiple"
                    placeholder="Select faculties"
                    value={facultyCodes}
                    onChange={setFacultyCodes}
                    options={faculties.map(f => ({ label: f, value: f }))}
                    disabled={isLoading}
                    className="w-full"
                    notFoundContent={<span>No options available</span>}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Courses
                  </label>
                  <Select
                    mode="multiple"
                    placeholder="Select courses"
                    value={courseCodes}
                    onChange={setCourseCodes}
                    options={availableCourses.map(c => ({ label: c, value: c }))}
                    disabled={isLoading || !availableCourses.length}
                    className="w-full"
                    notFoundContent={<span>No options available</span>}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Classes
                  </label>
                  <Select
                    mode="multiple"
                    placeholder="Select classes"
                    value={classCodes}
                    onChange={setClassCodes}
                    options={availableClasses.map(c => ({ label: c, value: c }))}
                    disabled={isLoading || !availableClasses.length}
                    className="w-full"
                    notFoundContent={<span>No options available</span>}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Users
                  </label>
                  <Select
                    mode="multiple"
                    placeholder="Select users"
                    value={userNames}
                    onChange={setUserNames}
                    options={availableUserNames.map(u => ({ label: u, value: u }))}
                    disabled={isLoading || !availableUserNames.length}
                    className="w-full"
                    notFoundContent={<span>No options available</span>}
                  />
                </div>
              </div>
            )}

            {errors.recipients && (
              <p className="text-red-500 text-xs">{errors.recipients}</p>
            )}

            {recipientType === 'specific' && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>{filteredUsers.length}</strong> users will receive this notification
                </p>
                {filteredUsers.length === 0 && (
                  <p className="text-sm text-amber-600 mt-1">
                    No users match the selected criteria
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8">
          <Button
            icon={<EyeOutlined />}
            onClick={handlePreview}
            disabled={isLoading}
            className="border-gray-300 hover:bg-gray-50"
          >
            Preview
          </Button>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSubmit}
            disabled={isLoading}
            loading={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Send Notification
          </Button>
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        title="Notification Preview"
        open={isPreviewVisible}
        onCancel={() => setIsPreviewVisible(false)}
        footer={null}
        className="max-w-md"
      >
        <div className={`p-4 rounded-lg border-l-4 ${currentNotificationType?.bgColor} border-l-${currentNotificationType?.color.split('-')[1]}-500`}>
          {title && (
            <h4 className={`font-semibold mb-2 ${currentNotificationType?.color}`}>
              {title}
            </h4>
          )}
          {body && (
            <p className="text-gray-700 mb-3">{body}</p>
          )}
          {imageFile && (
            <img
              src={imageFile.previewUrl}
              alt="Preview"
              className="w-full rounded-lg"
            />
          )}
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
            <span className={`text-xs px-2 py-1 rounded ${currentNotificationType?.bgColor} ${currentNotificationType?.color}`}>
              {currentNotificationType?.label}
            </span>
            <span className="text-xs text-gray-500">Just now</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NotificationSender;