import React, { useState, useEffect } from "react";
import {
  Card,
  Select,
  Checkbox,
  Button,
  Divider,
  Typography,
  Input,
  Upload,
  Modal,
  message,
  Spin,
} from "antd";
import { UploadOutlined, CloseOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from 'react-redux';
import { sendNotification, selectNotificationLoading, selectNotificationSuccess, selectNotificationError, clearError, clearSuccess } from '../../../store/slices/notificationSlice';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const faculties = ["CNTT", "QTKD", "KTY"];
const courses = ["K24", "K25", "K26", "K27"];
const classes = ["K27CNTTA", "K27CNTTB", "K27QTKDA"];
const users = ["user01", "user02", "user03"];
const notificationTypes = [
  { value: "default", label: "Default", color: "text-gray-600" },
  { value: "event", label: "Event", color: "text-blue-600" },
  { value: "warning", label: "Warning", color: "text-red-600" },
  { value: "announcement", label: "Announcement", color: "text-green-600" },
  { value: "reminder", label: "Reminder", color: "text-yellow-600" },
  { value: "urgent", label: "Urgent", color: "text-purple-600" },
];

interface UploadFile {
  file: File;
  fileName: string;
}

const NotificationSelector: React.FC = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectNotificationLoading);
  const success = useSelector(selectNotificationSuccess);
  const error = useSelector(selectNotificationError);

  const [type, setType] = useState("Thông báo trường");
  const [sendAll, setSendAll] = useState(false);
  const [facultySelected, setFacultySelected] = useState<string[]>([]);
  const [sendAllFaculty, setSendAllFaculty] = useState(false);
  const [courseSelected, setCourseSelected] = useState<string[]>([]);
  const [sendAllCourse, setSendAllCourse] = useState(false);
  const [classSelected, setClassSelected] = useState<string[]>([]);
  const [sendAllClass, setSendAllClass] = useState(false);
  const [userSelected, setUserSelected] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageFile, setImageFile] = useState<UploadFile | null>(null);
  const [imageUrlPreview, setImageUrlPreview] = useState<string | null>(null);
  const [requestId, setRequestId] = useState("");
  const [typeValue, setTypeValue] = useState("default");
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const showCourse = facultySelected.length > 0 && !sendAllFaculty;
  const showClass = showCourse && courseSelected.length > 0 && !sendAllCourse;
  const showUser = showClass && classSelected.length > 0 && !sendAllClass;

  // Xử lý trạng thái gửi thông báo
  useEffect(() => {
    if (success) {
      message.success('Gửi thông báo thành công!');
      // Reset form
      setTitle("");
      setBody("");
      setImageFile(null);
      setImageUrlPreview(null);
      setRequestId("");
      setTypeValue("default");
      setSendAll(false);
      setFacultySelected([]);
      setSendAllFaculty(false);
      setCourseSelected([]);
      setSendAllCourse(false);
      setClassSelected([]);
      setSendAllClass(false);
      setUserSelected([]);
      dispatch(clearSuccess());
    }
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [success, error, dispatch]);

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ được chọn file ảnh!");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Ảnh phải nhỏ hơn 2MB!");
      return false;
    }
    return true;
  };

  const handleImageChange = (info: any) => {
    const file = info.file.originFileObj as File;
    if (file && beforeUpload(file)) {
      setImageFile({
        file,
        fileName: file.name,
      });

      const reader = new FileReader();
      reader.onload = () => {
        setImageUrlPreview(reader.result as string);
      };
      reader.onerror = () => {
        message.error("Không thể đọc file ảnh!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImageUrlPreview(null);
  };

  const handlePreview = () => {
    if (title || body || imageUrlPreview) {
      setIsPreviewVisible(true);
    } else {
      message.info("Vui lòng nhập tiêu đề, nội dung hoặc chọn ảnh để xem trước!");
    }
  };

  const handleCancelPreview = () => {
    setIsPreviewVisible(false);
  };

  const handleSubmit = () => {
    if (!title || !body) {
      message.error("Vui lòng nhập tiêu đề và nội dung thông báo!");
      return;
    }

    if (imageFile) {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile.file);
      reader.onload = () => {
        const base64String = reader.result as string;

        const payload: any = {
          Title: title,
          Body: body,
          Image: { Base64String: base64String, FileName: imageFile.fileName },
          RequestId: requestId || null,
          Type: typeValue,
          FacultyCodes: null,
          CourseCodes: null,
          ClassCodes: null,
          UserNames: null,
          SendAll: sendAll,
        };

        if (!sendAll) {
          if (sendAllFaculty) {
            payload.FacultyCodes = facultySelected;
          }
          if (sendAllCourse) {
            payload.FacultyCodes = facultySelected;
            payload.CourseCodes = courseSelected;
          }
          if (sendAllClass) {
            payload.FacultyCodes = facultySelected;
            payload.CourseCodes = courseSelected;
            payload.ClassCodes = classSelected;
          }
          if (userSelected.length > 0) {
            payload.FacultyCodes = facultySelected;
            payload.CourseCodes = courseSelected;
            payload.ClassCodes = classSelected;
            payload.UserNames = userSelected;
          }
        }

        dispatch(sendNotification(payload) as any);
      };
      reader.onerror = () => {
        message.error("Không thể chuyển đổi ảnh sang Base64!");
      };
    } else {
      const payload: any = {
        Title: title,
        Body: body,
        Image: null,
        RequestId: requestId || null,
        Type: typeValue,
        FacultyCodes: null,
        CourseCodes: null,
        UserNames: null,
        SendAll: sendAll,
      };

      if (!sendAll) {
        if (sendAllFaculty) {
          payload.FacultyCodes = facultySelected;
        }
        if (sendAllCourse) {
          payload.FacultyCodes = facultySelected;
          payload.CourseCodes = courseSelected;
        }
        if (sendAllClass) {
          payload.FacultyCodes = facultySelected;
          payload.CourseCodes = courseSelected;
          payload.ClassCodes = classSelected;
        }
        if (userSelected.length > 0) {
          payload.FacultyCodes = facultySelected;
          payload.CourseCodes = courseSelected;
          payload.ClassCodes = classSelected;
          payload.UserNames = userSelected;
        }
      }

      dispatch(sendNotification(payload) as any);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card>
        <Title level={4}>📢 Gửi thông báo</Title>

        {/* Nội dung thông báo */}
        <div className="space-y-6 mb-4">
          <Input
            placeholder="Tiêu đề thông báo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border-gray-300 shadow-sm"
          />
          <div className="mt-4"></div>
          <TextArea
            placeholder="Nội dung thông báo"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            className="w-full rounded-lg border-gray-300 shadow-sm"
          />
          <div className="flex items-center mt-5">
            {imageUrlPreview ? (
              <div className="relative w-full">
                <img
                  src={imageUrlPreview}
                  alt="Selected"
                  className="w-full h-[200px] object-cover rounded-lg"
                />
                <CloseOutlined
                  className="absolute top-2 right-2 bg-gray-200 rounded-full p-1 cursor-pointer text-gray-600 hover:bg-gray-300 transition"
                  onClick={handleRemoveImage}
                />
              </div>
            ) : (
              <Upload
                listType="picture-card"
                maxCount={1}
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleImageChange}
                accept="image/*"
              >
                <div>
                  <UploadOutlined />
                  <div className="ant-upload-text">Chọn hoặc kéo thả ảnh</div>
                </div>
              </Upload>
            )}
          </div>
          <Select
            value={typeValue}
            onChange={setTypeValue}
            className="w-full"
            popupClassName="rounded-lg shadow-lg border border-gray-200"
            optionRender={({ data }) => {
              const type = notificationTypes.find((t) => t.value === data.value);
              return (
                <div
                  className={`flex items-center px-3 py-2 rounded mx-1 hover:bg-gray-100 transition-colors ${type?.color}`}
                  style={{ backgroundColor: type?.color.replace("text-", "bg-") + "/10" }}
                >
                  <span>{type?.label}</span>
                </div>
              );
            }}
          >
            {notificationTypes.map((type) => (
              <Option key={type.value} value={type.value}>
                {type.label}
              </Option>
            ))}
          </Select>
        </div>

        <Divider />

        <Checkbox checked={sendAll} onChange={(e) => setSendAll(e.target.checked)}>
          Gửi đến toàn bộ trường
        </Checkbox>

        {!sendAll && (
          <div className="space-y-4 mt-4">
            <div>
              <label>Chọn ngành</label>
              <Select
                mode="multiple"
                className="w-full mt-1"
                placeholder="Chọn ngành"
                value={facultySelected}
                onChange={setFacultySelected}
              >
                {faculties.map((f) => (
                  <Option key={f}>{f}</Option>
                ))}
              </Select>
              <Checkbox
                checked={sendAllFaculty}
                onChange={(e) => setSendAllFaculty(e.target.checked)}
                className="mt-2"
              >
                Gửi đến tất cả ngành đã chọn
              </Checkbox>
            </div>
            {showCourse && (
              <div>
                <label>Chọn khóa</label>
                <Select
                  mode="multiple"
                  className="w-full mt-1"
                  placeholder="Chọn khóa"
                  value={courseSelected}
                  onChange={setCourseSelected}
                >
                  {courses.map((c) => (
                    <Option key={c}>{c}</Option>
                  ))}
                </Select>
                <Checkbox
                  checked={sendAllCourse}
                  onChange={(e) => setSendAllCourse(e.target.checked)}
                  className="mt-2"
                >
                  Gửi đến tất cả khóa đã chọn
                </Checkbox>
              </div>
            )}
            {showClass && (
              <div>
                <label>Chọn lớp</label>
                <Select
                  mode="multiple"
                  className="w-full mt-1"
                  placeholder="Chọn lớp"
                  value={classSelected}
                  onChange={setClassSelected}
                >
                  {classes.map((cls) => (
                    <Option key={cls}>{cls}</Option>
                  ))}
                </Select>
                <Checkbox
                  checked={sendAllClass}
                  onChange={(e) => setSendAllClass(e.target.checked)}
                  className="mt-2"
                >
                  Gửi đến tất cả lớp đã chọn
                </Checkbox>
              </div>
            )}
            {showUser && (
              <div>
                <label>Chọn người dùng cụ thể</label>
                <Select
                  mode="multiple"
                  className="w-full mt-1"
                  placeholder="Chọn người dùng"
                  value={userSelected}
                  onChange={setUserSelected}
                >
                  {users.map((u) => (
                    <Option key={u}>{u}</Option>
                  ))}
                </Select>
              </div>
            )}
          </div>
        )}

        <Divider />

        <Button className="mb-2 mr-5" onClick={handlePreview}>
          👀 Xem trước
        </Button>
        <Button
          type="primary"
          className="bg-blue-600"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? <Spin size="small" /> : "✅ Gửi thông báo"}
        </Button>
      </Card>

      <Modal
        title="Xem trước thông báo"
        open={isPreviewVisible}
        onCancel={handleCancelPreview}
        footer={null}
      >
        {title && <Typography.Title level={5}>{title}</Typography.Title>}
        {body && <Typography.Paragraph>{body}</Typography.Paragraph>}
        {imageUrlPreview && (
          <img alt="Preview" style={{ width: "100%" }} src={imageUrlPreview} />
        )}
      </Modal>
    </div>
  );
};

export default NotificationSelector;