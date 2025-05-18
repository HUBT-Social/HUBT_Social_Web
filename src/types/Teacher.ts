// Định nghĩa interface cho Teacher
export interface Teacher {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  email: string;
  phoneNumber: string;
  gender: number;
  dateOfBirth: string;
  
  age: number;
  status: 'active' | 'inactive' | string;
}