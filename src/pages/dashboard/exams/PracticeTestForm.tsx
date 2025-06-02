import { UploadOutlined } from '@ant-design/icons';
import { Button, Collapse, Form, Input, Select, Upload, message } from 'antd';
import { FC, useState } from 'react';
import { uploadTestFile } from '../../../services/api';
import { PracticeTestFormValues, TestType } from '../../../types/PracticeTestType';

const { TextArea } = Input;
const { Panel } = Collapse;

interface PracticeTestFormProps {
  initialValues?: PracticeTestFormValues;
  onSubmit: (values: PracticeTestFormValues) => Promise<void>;
  loading: boolean;
}

const PracticeTestForm: FC<PracticeTestFormProps> = ({ initialValues, onSubmit, loading }) => {
  const [form] = Form.useForm();
  const [fileUploaded, setFileUploaded] = useState(false);

  const handleFileUpload = async (file: File) => {
    try {
      const data = await uploadTestFile(file);
      form.setFieldsValue(data);
      setFileUploaded(true);
      message.success('Tải file thành công!');
    } catch (error) {
      message.error('Tải file thất bại!');
    }
    return false; // Ngăn upload mặc định của Ant Design
  };

  const handleFinish = async (values: PracticeTestFormValues) => {
    if (!fileUploaded && !initialValues) {
      message.error('Vui lòng tải lên file đề!');
      return;
    }
    await onSubmit(values);
  };

  return (
    <Form
      form={form}
      initialValues={initialValues}
      onFinish={handleFinish}
      layout="vertical"
      className="flex flex-col gap-4"
    >
      <Form.Item
        name="title"
        label="Tiêu đề"
        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
      >
        <Input placeholder="Nhập tiêu đề đề ôn tập" />
      </Form.Item>
      <Form.Item
        name="description"
        label="Mô tả"
        rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
      >
        <TextArea placeholder="Nhập mô tả" rows={4} />
      </Form.Item>
      <Form.Item
        name="type"
        label="Loại đề"
        rules={[{ required: true, message: 'Vui lòng chọn loại' }]}
      >
        <Select placeholder="Chọn loại đề">
          <Select.Option value={TestType.Practice}>Ôn tập</Select.Option>
          <Select.Option value={TestType.Exam}>Thi chính thức</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="file"
        label="File đề"
        rules={[{ required: !initialValues, message: 'Vui lòng tải lên file' }]}
      >
        <Upload
          beforeUpload={handleFileUpload}
          accept=".pdf"
          showUploadList={false}
          className="w-full"
        >
          <Button icon={<UploadOutlined />}>Tải lên file PDF</Button>
        </Upload>
      </Form.Item>
      <Form.Item name="fileUrl" hidden>
        <Input />
      </Form.Item>
      <Form.Item name="fileName" hidden>
        <Input />
      </Form.Item>
      <Form.Item
        name="problemJson"
        label="Nội dung đề (JSON)"
        rules={[{ required: true, message: 'Vui lòng cung cấp JSON đề' }]}
      >
        <TextArea
          rows={6}
          placeholder="Chuỗi JSON của đề bài"
          readOnly={!fileUploaded && !initialValues}
        />
      </Form.Item>
      {form.getFieldValue('problemJson') && (
        <Collapse>
          <Panel header="Xem trước đề bài" key="1">
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
              {JSON.stringify(JSON.parse(form.getFieldValue('problemJson') || '{}'), null, 2)}
            </pre>
          </Panel>
        </Collapse>
      )}
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className="bg-primary hover:bg-blue-700 w-full"
        >
          Lưu
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PracticeTestForm;