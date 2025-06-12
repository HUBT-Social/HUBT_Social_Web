import React, { useState } from 'react';
import { Upload, X, FileText, Plus } from 'lucide-react';

interface ExamFormProps {
  onFinish: (values: any) => void;
  initialValues?: any;
}

const ExamForm: React.FC<ExamFormProps> = ({onFinish, initialValues = {} }) => {
  const [formData, setFormData] = useState({
    title: initialValues.title || '',
    description: initialValues.description || '',
    major: initialValues.major || '',
    credits: initialValues.credits || '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      const allowedTypes = ['.pdf', '.doc', '.docx'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (allowedTypes.includes(fileExtension)) {
        setSelectedFile(file);
        if (errors.file) {
          setErrors(prev => ({ ...prev, file: '' }));
        }
      } else {
        alert('Chỉ chấp nhận file PDF, DOC, DOCX');
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Vui lòng nhập tiêu đề!';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Vui lòng nhập mô tả!';
    }
    
    if (!formData.major.trim()) {
      newErrors.major = 'Vui lòng nhập môn học!';
    }
    
    if (!selectedFile && !initialValues.fileName) {
      newErrors.file = 'Vui lòng chọn tệp!';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const submitData = {
        ...formData,
        file: selectedFile,
        credits: formData.credits ? parseInt(formData.credits) : null
      };
      
      onFinish(submitData);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      major: '',
      credits: '',
    });
    setSelectedFile(null);
    setErrors({});
    
  };

  const getFileIcon = (fileName: string) => {
    console.log(fileName);
    return <FileText className="w-5 h-5 text-red-500" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto border border-gray-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {initialValues.title ? 'Cập nhật bài kiểm tra' : 'Thêm bài kiểm tra mới'}
        </h2>
        <p className="text-gray-600">Điền thông tin chi tiết cho bài kiểm tra</p>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Nhập tiêu đề bài kiểm tra"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
              {errors.title}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Mô tả <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Nhập mô tả chi tiết về bài kiểm tra"
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
              errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
              {errors.description}
            </p>
          )}
        </div>

        {/* Major and Credits Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Môn học <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.major}
              onChange={(e) => handleInputChange('major', e.target.value)}
              placeholder="Ví dụ: Toán học, Vật lý..."
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.major ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.major && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                {errors.major}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Số tín chỉ
            </label>
            <input
              type="number"
              value={formData.credits}
              onChange={(e) => handleInputChange('credits', e.target.value)}
              placeholder="Nhập số tín chỉ"
              min="0"
              max="10"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tệp đính kèm <span className="text-red-500">*</span>
          </label>
          
          {!selectedFile && !initialValues.fileName ? (
            <div className={`relative border-2 border-dashed rounded-lg p-6 transition-colors hover:bg-gray-50 ${
              errors.file ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}>
              <input
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="file-upload"
              />
              <div className="text-center cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-1">
                  <span className="font-semibold text-blue-600">Nhấp để chọn tệp</span> hoặc kéo thả vào đây
                </p>
                <p className="text-sm text-gray-500">Hỗ trợ: PDF, DOC, DOCX (tối đa 10MB)</p>
              </div>
            </div>
          ) : (
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedFile ? getFileIcon(selectedFile.name) : <FileText className="w-5 h-5 text-red-500" />}
                  <div>
                    <p className="font-medium text-gray-800">
                      {selectedFile ? selectedFile.name : initialValues.fileName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'Tệp hiện tại'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                  title="Xóa tệp"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="mt-3">
                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  id="file-replace"
                />
                <label
                  htmlFor="file-replace"
                  className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Thay đổi tệp
                </label>
              </div>
            </div>
          )}
          
          {errors.file && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
              {errors.file}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {initialValues.title ? 'Cập nhật bài kiểm tra' : 'Thêm bài kiểm tra'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamForm;