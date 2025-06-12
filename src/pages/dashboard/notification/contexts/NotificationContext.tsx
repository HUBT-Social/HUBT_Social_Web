import type { Dayjs } from 'dayjs'; // Thêm import Dayjs
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import {Notification} from '../../../../types/Notification';
import { UserInfo } from '../../../../types/userInfo';





interface Template {
  id: string;
  title: string;
  content: string;
  type: string;
}

// Define the shape of the context value
interface NotificationContextType {
  // UI state
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isPreviewVisible: boolean;
  setIsPreviewVisible: React.Dispatch<React.SetStateAction<boolean>>;
  previewDevice: string;
  setPreviewDevice: React.Dispatch<React.SetStateAction<string>>;
  templateMode: boolean;
  setTemplateMode: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Form state
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  body: string;
  setBody: React.Dispatch<React.SetStateAction<string>>;
  imageFile: any | null;
  setImageFile: React.Dispatch<React.SetStateAction<any | null>>;
  type: string;
  setType: React.Dispatch<React.SetStateAction<string>>;
  recipientType: string;
  setRecipientType: React.Dispatch<React.SetStateAction<string>>;
  facultyCodes: string[];
  setFacultyCodes: React.Dispatch<React.SetStateAction<string[]>>;
  courseCodes: string[];
  setCourseCodes: React.Dispatch<React.SetStateAction<string[]>>;
  classCodes: string[];
  setClassCodes: React.Dispatch<React.SetStateAction<string[]>>;
  userNames: string[];
  setUserNames: React.Dispatch<React.SetStateAction<string[]>>;
  scheduleEnabled: boolean;
  setScheduleEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  scheduledTime: Dayjs | null;
  setScheduledTime: React.Dispatch<React.SetStateAction<Dayjs | null>>;
  priority: string;
  setPriority: React.Dispatch<React.SetStateAction<string>>;
  deliveryChannels: string[];
  setDeliveryChannels: React.Dispatch<React.SetStateAction<string[]>>;
  requestId: string;
  setRequestId: React.Dispatch<React.SetStateAction<string>>;
  errors: { [key: string]: string };
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  
  // Data
  users: UserInfo[];
  setUsers: React.Dispatch<React.SetStateAction<UserInfo[]>>;
  selectedTemplate: Template | null;
  setSelectedTemplate: React.Dispatch<React.SetStateAction<Template | null>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filterType: string;
  setFilterType: React.Dispatch<React.SetStateAction<string>>;
}

// Create the context with a default value of undefined
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Custom hook to use the context
export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

// Props for the NotificationProvider component
interface NotificationProviderProps {
  children: ReactNode;
}

// NotificationProvider component
export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  // UI state
  const [activeTab, setActiveTab] = useState<string>('compose');
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);
  const [previewDevice, setPreviewDevice] = useState<string>('mobile');
  const [templateMode, setTemplateMode] = useState<boolean>(false);

  // Form state
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [imageFile, setImageFile] = useState<any | null>(null);
  const [type, setType] = useState<string>('default');
  const [recipientType, setRecipientType] = useState<string>('all');
  const [facultyCodes, setFacultyCodes] = useState<string[]>([]);
  const [courseCodes, setCourseCodes] = useState<string[]>([]);
  const [classCodes, setClassCodes] = useState<string[]>([]);
  const [userNames, setUserNames] = useState<string[]>([]);
  const [scheduleEnabled, setScheduleEnabled] = useState<boolean>(false);
  const [scheduledTime, setScheduledTime] = useState<any | null>(null);
  const [priority, setPriority] = useState<string>('normal');
  const [deliveryChannels, setDeliveryChannels] = useState<string[]>(['push']);
  const [requestId, setRequestId] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Data
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');

  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const value: NotificationContextType = {
    // UI state
    activeTab,
    setActiveTab,
    isLoading,
    setIsLoading,
    isPreviewVisible,
    setIsPreviewVisible,
    previewDevice,
    setPreviewDevice,
    templateMode,
    setTemplateMode,

    // Form state
    title,
    setTitle,
    body,
    setBody,
    imageFile,
    setImageFile,
    type,
    setType,
    recipientType,
    setRecipientType,
    facultyCodes,
    setFacultyCodes,
    courseCodes,
    setCourseCodes,
    classCodes,
    setClassCodes,
    userNames,
    setUserNames,
    scheduleEnabled,
    setScheduleEnabled,
    scheduledTime,
    setScheduledTime,
    priority,
    setPriority,
    deliveryChannels,
    setDeliveryChannels,
    requestId,
    setRequestId,
    errors,
    setErrors,

    selectedTemplate,
    setSelectedTemplate,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    users: [],
    setUsers: function (): void {
      throw new Error('Function not implemented.');
    },
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};