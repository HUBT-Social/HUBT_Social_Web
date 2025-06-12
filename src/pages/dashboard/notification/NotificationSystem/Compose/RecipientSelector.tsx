import React, { FC } from 'react';
import { Row, Col, Radio, Select, Alert, Progress, Typography, Avatar } from 'antd';
import { UserOutlined, TeamOutlined, GlobalOutlined, BookOutlined, UsergroupAddOutlined, CrownOutlined } from '@ant-design/icons';
import { useNotificationContext } from '../../contexts/NotificationContext';
import { UserInfo } from '../../../../../types/userInfo';
const { Title, Text } = Typography;

interface UserAvaible {
  userName: string,
  name: string | null,
  avatarUrl: string | null
}

const RecipientSelector: FC = () => {
  const { 
    recipientType, setRecipientType,
    facultyCodes, setFacultyCodes,
    courseCodes, setCourseCodes,
    classCodes, setClassCodes,
    userNames, setUserNames,
    errors,
    users,
    isLoading
  } = useNotificationContext();

  // Parse className pattern: [A-Z]+(\d)+.+(\d) - example: TH27.25
  const parseClassName = (className: string | null) => {
    if (!className) return null;
    
    const match = className.match(/^([A-Z]+)(\d+)\.(\d+)$/);
    if (!match) return null;
    
    return {
      faculty: match[1],    // TH
      course: match[2],     // 27
      classNumber: match[3] // 25
    };
  };

  // Temp users - filtered step by step based on conditions
  const tempUsers = React.useMemo<UserInfo[]>(() => {
    let filtered = [...users];
    
    console.log('=== FILTERING PROCESS ===');
    console.log('Initial users:', filtered.length);

    // Step 1: Filter by recipientType
    if (recipientType === 'all') {
      console.log('Broadcasting to all users');
      return filtered;
    }

    // Step 2: Filter by facultyCodes
    if (facultyCodes.length > 0) {
      filtered = filtered.filter(user => {
        const parsed = parseClassName(user.className);
        const match = parsed && facultyCodes.includes(parsed.faculty);
        if (!match && user.className) {
          console.log(`Filtered out by faculty: ${user.userName} (${user.className})`);
        }
        return match || !user.className; // Keep users without className
      });
      console.log(`After faculty filter (${facultyCodes.join(', ')}):`, filtered.length);
    }

    // Step 3: Filter by courseCodes
    if (courseCodes.length > 0) {
      filtered = filtered.filter(user => {
        const parsed = parseClassName(user.className);
        const match = parsed && courseCodes.includes(parsed.course);
        if (!match && user.className) {
          console.log(`Filtered out by course: ${user.userName} (${user.className})`);
        }
        return match || !user.className;
      });
      console.log(`After course filter (${courseCodes.join(', ')}):`, filtered.length);
    }

    // Step 4: Filter by classCodes (full className)
    if (classCodes.length > 0) {
      filtered = filtered.filter(user => {
        const match = user.className && classCodes.includes(user.className);
        if (!match && user.className) {
          console.log(`Filtered out by class: ${user.userName} (${user.className})`);
        }
        return match || !user.className;
      });
      console.log(`After class filter (${classCodes.join(', ')}):`, filtered.length);
    }

    // Step 5: Filter by userNames (individual users)
    if (userNames.length > 0) {
      filtered = filtered.filter(user => {
        const match = userNames.includes(user.userName);
        if (!match) {
          console.log(`Filtered out by username: ${user.userName}`);
        }
        return match;
      });
      console.log(`After username filter (${userNames.join(', ')}):`, filtered.length);
    }

    console.log('=== FINAL FILTERED USERS ===');
    console.log('Count:', filtered.length);
    console.log('Users:', filtered.map(u => `${u.userName} (${u.className || 'No class'})`));
    
    return filtered;
  }, [users, recipientType, facultyCodes, courseCodes, classCodes, userNames]);

  // Extract unique faculties from all users
  const availableFaculties = React.useMemo<string[]>(() => {
    const facultiesSet = new Set<string>();
    users.forEach(user => {
      const parsed = parseClassName(user.className);
      if (parsed) {
        facultiesSet.add(parsed.faculty);
      }
    });
    return Array.from(facultiesSet).sort();
  }, [users]);

  // Extract available courses based on current faculty selection
  const availableCourses = React.useMemo<string[]>(() => {
    const coursesSet = new Set<string>();
    
    // If no faculty selected, show all courses
    if (facultyCodes.length === 0) {
      users.forEach(user => {
        const parsed = parseClassName(user.className);
        if (parsed) {
          coursesSet.add(parsed.course);
        }
      });
    } else {
      // Show courses only from selected faculties
      users.forEach(user => {
        const parsed = parseClassName(user.className);
        if (parsed && facultyCodes.includes(parsed.faculty)) {
          coursesSet.add(parsed.course);
        }
      });
    }
    
    return Array.from(coursesSet).sort();
  }, [users, facultyCodes]);

  // Extract available classes based on current faculty + course selection
  const availableClasses = React.useMemo<string[]>(() => {
    const classesSet = new Set<string>();
    
    users.forEach(user => {
      if (!user.className) return;
      
      const parsed = parseClassName(user.className);
      if (!parsed) return;
      
      // Check if matches current filters
      const matchesFaculty = facultyCodes.length === 0 || facultyCodes.includes(parsed.faculty);
      const matchesCourse = courseCodes.length === 0 || courseCodes.includes(parsed.course);
      
      if (matchesFaculty && matchesCourse) {
        classesSet.add(user.className);
      }
    });
    
    return Array.from(classesSet).sort();
  }, [users, facultyCodes, courseCodes]);

  // Extract available usernames based on current filters
  const availableUsers = React.useMemo<UserAvaible[]>(() => {
    const userNamesSet = new Set<UserAvaible>();
    
    users.forEach(user => {
      // If no class filters, include all users
      if (facultyCodes.length === 0 && courseCodes.length === 0 && classCodes.length === 0) {
        userNamesSet.add(
          {
            userName : user.userName,
            name : user.firstName + ' ' + user.lastName,
            avatarUrl : user.avataUrl
          } as UserAvaible 
        );
        return;
      }
      
      // For users without className, only include if no class filters
      if (!user.className) {
        if (facultyCodes.length === 0 && courseCodes.length === 0 && classCodes.length === 0) {
          userNamesSet.add({
            userName : user.userName,
            name : user.firstName + ' ' + user.lastName,
            avatarUrl : user.avataUrl
          } as UserAvaible );
        }
        return;
      }
      
      const parsed = parseClassName(user.className);
      if (!parsed) return;
      
      // Check if matches current filters
      const matchesFaculty = facultyCodes.length === 0 || facultyCodes.includes(parsed.faculty);
      const matchesCourse = courseCodes.length === 0 || courseCodes.includes(parsed.course);
      const matchesClass = classCodes.length === 0 || classCodes.includes(user.className);
      
      if (matchesFaculty && matchesCourse && matchesClass) {
        userNamesSet.add({
            userName : user.userName,
            name : user.firstName + ' ' + user.lastName,
            avatarUrl : user.avataUrl
          } as UserAvaible );
      }
    });
    
    return Array.from(userNamesSet).sort();
  }, [users, facultyCodes, courseCodes, classCodes]);

  // Auto-clean dependent selections when parent selections change
  React.useEffect(() => {
    // Clean courses when faculty changes
    if (facultyCodes.length > 0) {
      const validCourses = courseCodes.filter(code => availableCourses.includes(code));
      if (validCourses.length !== courseCodes.length) {
        setCourseCodes(validCourses);
        console.log('Auto-cleaned courses:', courseCodes.filter(c => !validCourses.includes(c)));
      }
    }
  }, [facultyCodes, availableCourses, courseCodes, setCourseCodes]);

  React.useEffect(() => {
    // Clean classes when faculty or course changes
    if (facultyCodes.length > 0 || courseCodes.length > 0) {
      const validClasses = classCodes.filter(code => availableClasses.includes(code));
      if (validClasses.length !== classCodes.length) {
        setClassCodes(validClasses);
        console.log('Auto-cleaned classes:', classCodes.filter(c => !validClasses.includes(c)));
      }
    }
  }, [facultyCodes, courseCodes, availableClasses, classCodes, setClassCodes]);

  React.useEffect(() => {
    // Clean usernames when any filter changes
    const userNameAvailbes: string[] = availableUsers.map(({ userName }) => userName);
    const validUserNames = userNames.filter(name => userNameAvailbes.includes(name));
    if (validUserNames.length !== userNames.length) {
      setUserNames(validUserNames);
      console.log('Auto-cleaned usernames:', userNames.filter(n => !validUserNames.includes(n)));
    }
  }, [facultyCodes, courseCodes, classCodes, availableUsers, userNames, setUserNames]);

  function truncateNameIfTooLong(fullName: string | null, maxLength: number = 20): string | null {
  // Chỉ cắt nếu vượt quá độ dài cho phép

  if (fullName === null || fullName.length <= maxLength) {
    return fullName;
  }
  
  const words = fullName.trim().split(/\s+/);
  
  // Chỉ cắt nếu có từ 4 từ trở lên  
  if (words.length < 4) {
    return fullName;
  }
  
  // Lấy từ đầu (họ) và từ cuối (tên)
  return `${words[0]} ${words[1]} ... ${words[words.length - 1]}`;
}

  return (
    <div className="space-y-6">
      {/* Recipient Type Selection */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <Radio.Group
          value={recipientType}
          onChange={(e) => setRecipientType(e.target.value)}
          disabled={isLoading}
          className="w-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                recipientType === 'all' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
              }`}
              onClick={() => setRecipientType('all')}
            >
              <Radio value="all" className="mb-2">
                <span className="font-semibold">Broadcast to All</span>
              </Radio>
              <div className="ml-6">
                <GlobalOutlined className="mr-2 text-blue-500" />
                <Text type="secondary">Send to entire school ({users.length} users)</Text>
              </div>
            </div>
            
            <div 
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                recipientType === 'specific' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
              }`}
              onClick={() => setRecipientType('specific')}
            >
              <Radio value="specific" className="mb-2">
                <span className="font-semibold">Target Specific Groups</span>
              </Radio>
              <div className="ml-6">
                <TeamOutlined className="mr-2 text-green-500" />
                <Text type="secondary">Filter by faculty, course, class, or users</Text>
              </div>
            </div>
          </div>
        </Radio.Group>
      </div>

      {/* Specific Recipients Filters */}
      {recipientType === 'specific' && (
        <div className="space-y-4 animate-fade-in">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  <BookOutlined className="mr-1" />
                  Faculties ({availableFaculties.length})
                </label>
                <Select
                  mode="multiple"
                  placeholder="Select faculties"
                  value={facultyCodes}
                  onChange={setFacultyCodes}
                  options={availableFaculties.map(f => ({ label: f, value: f }))}
                  disabled={isLoading}
                  className="w-full"
                  showSearch
                  filterOption={(input: string, option?: { label: string; value: string }) =>
                    option?.label.toLowerCase().includes(input.toLowerCase()) ?? false
                  }
                />
              </div>
            </Col>
            
            <Col xs={24} sm={12} lg={6}>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  <CrownOutlined className="mr-1" />
                  Courses ({availableCourses.length})
                </label>
                <Select
                  mode="multiple"
                  placeholder="Select courses"
                  value={courseCodes}
                  onChange={setCourseCodes}
                  options={availableCourses.map(c => ({ label: c, value: c }))}
                  disabled={isLoading || !availableCourses.length}
                  className="w-full"
                  showSearch
                  filterOption={(input: string, option?: { label: string; value: string }) =>
                    option?.label.toLowerCase().includes(input.toLowerCase()) ?? false
                  }
                />
              </div>
            </Col>
            
            <Col xs={24} sm={12} lg={6}>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  <UsergroupAddOutlined className="mr-1" />
                  Classes ({availableClasses.length})
                </label>
                <Select
                  mode="multiple"
                  placeholder="Select classes"
                  value={classCodes}
                  onChange={setClassCodes}
                  options={availableClasses.map(c => ({ label: c, value: c }))}
                  disabled={isLoading || !availableClasses.length}
                  className="w-full"
                  showSearch
                  filterOption={(input: string, option?: { label: string; value: string }) =>
                    option?.label.toLowerCase().includes(input.toLowerCase()) ?? false
                  }
                />
              </div>
            </Col>
            
            <Col xs={24} sm={12} lg={6}>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  <UserOutlined className="mr-1" />
                  Users ({availableUsers.length})
                </label>
                <Select
                  mode="multiple"
                  placeholder="Select users"
                  value={userNames}
                  onChange={setUserNames}
                  options={availableUsers.map(u => ({ 
                    label: u.userName, 
                    value: u.userName,
                    name: u.name,
                    avatar: users.find(user => user.userName === u.userName)?.avataUrl
                  }))}
                  disabled={isLoading || !availableUsers.length}
                  className="w-full"
                  showSearch
                  filterOption={(input: string, option?: { label: string; value: string }) =>
                    option?.label.toLowerCase().includes(input.toLowerCase()) ?? false
                  }
                  optionRender={(option) => (
                    <div className="flex items-center gap-3">
                      <Avatar 
                        size="large" 
                        src={option.data.avatar} 
                        icon={!option.data.avatar && <UserOutlined />} 
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {truncateNameIfTooLong(option.data.name)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {option.data.value}
                        </span>
                      </div>
                    </div>
                  )}
                />
              </div>
            </Col>
          </Row>

          {errors.recipients && (
            <Alert
              message={errors.recipients}
              type="error"
              showIcon
              className="mt-4"
            />
          )}

          {/* Recipients Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <Row align="middle" gutter={16}>
              <Col>
                <div className="bg-blue-500 p-3 rounded-full">
                  <UsergroupAddOutlined className="text-white text-lg" />
                </div>
              </Col>
              <Col flex={1}>
                <div>
                  <Title level={4} className="mb-1 text-blue-700">
                    {tempUsers.length} Recipients Selected
                  </Title>
                  <Text type="secondary">
                    {tempUsers.length === 0 
                      ? 'No users match the selected criteria' 
                      : `Notification will be sent to ${tempUsers.length} users`
                    }
                  </Text>
                  {tempUsers.length > 0 && tempUsers.length <= 10 && (
                    <div className="mt-2">
                      <Text type="secondary" className="text-xs">
                        Selected: {tempUsers.map(u => u.userName).join(', ')}
                      </Text>
                    </div>
                  )}
                </div>
              </Col>
              <Col>
                <Progress
                  type="circle"
                  size={60}
                  percent={Math.round((tempUsers.length / users.length) * 100)}
                  format={() => `${Math.round((tempUsers.length / users.length) * 100)}%`}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068'
                  }}
                />
              </Col>
            </Row>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipientSelector;