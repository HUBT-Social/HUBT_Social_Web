import React from 'react';
import { Button, Input, Spin } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

interface ChatPopupProps {
  visible: boolean;
  isConnecting: boolean;
  isReadyToChat: boolean;
  onClose: () => void;
  onSendMessage: (message: string) => void;
}

const ChatPopup: React.FC<ChatPopupProps> = ({
  visible,
  isConnecting,
  isReadyToChat,
  onClose,
  onSendMessage,
}) => {
  if (!visible) return null;

  return (
    <div className="fixed bottom-5 right-5 w-80 bg-white rounded-xl shadow-lg border p-4 z-50">
      <div className="flex justify-between items-center mb-3">
        <span className="font-semibold text-blue-600 text-lg">💬 Trò chuyện</span>
        <Button
          type="text"
          size="small"
          icon={<CloseOutlined />}
          onClick={onClose}
        />
      </div>

      {isConnecting && (
        <div className="text-center py-8 text-gray-500">
          <Spin tip="Đang kết nối phòng chat..." />
        </div>
      )}

      {!isConnecting && isReadyToChat && (
        <>
          <div className="h-48 overflow-y-auto space-y-2 mb-3 px-3 py-2 bg-gray-50 border rounded">
            <div className="text-sm text-gray-600">Bạn: Xin chào!</div>
            <div className="text-sm text-blue-600 text-right">Hệ thống: Chào bạn!</div>
          </div>

          <Input.Search
            placeholder="Nhập tin nhắn..."
            enterButton="Gửi"
            onSearch={onSendMessage}
          />
        </>
      )}
    </div>
  );
};

export default ChatPopup;