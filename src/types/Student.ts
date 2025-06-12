import { UserInfo } from "./user";


export interface AverageScore {
  maSV: string;
  diemTB10: number; // Đổi tên để rõ ràng hơn (diemTB10 -> gpa10)
  diemTB4: number; // Đổi tên để rõ ràng hơn (diemTB4 -> gpa4)
}

export interface AcademicPerformance {
  subjectName: string; // Đổi tên từ tenMonHoc để thống nhất tiếng Anh
  score: number; // Đổi tên từ diem để thống nhất tiếng Anh
}

export interface Student extends UserInfo, AverageScore {
  faculty: string;
  course: string;
  academicStatus: AcademicStatus; // Sử dụng type AcademicStatus
  subjects?: AcademicPerformance[];
}

// Utility types
export type StudentStatus = 'Active' | 'OnLeave' | 'DroppedOut' | 'Graduated' | 'Warning'; // Đổi tên để rõ ràng và thống nhất tiếng Anh
export type AcademicStatus =
  | 'Excellent'
  | 'VeryGood'
  | 'Good'
  | 'FairlyGood'
  | 'Average'
  | 'Weak'
  | 'Warning';
export type Gender = 0 | 1 | 2; // 0 = Other, 1 = Male, 2 = Female

// Helper functions with JSDoc for better documentation
/**
 * Creates a full name by combining firstName and lastName.
 * @param student - The student object containing firstName and lastName.
 * @returns The full name as a string.
 */
export const createFullName = (student: Pick<UserInfo, 'firstName' | 'lastName'>): string => {
  return `${student.firstName} ${student.lastName}`.trim();
};

/**
 * Calculates the age based on the date of birth.
 * @param dateOfBirth - The date of birth in ISO format (yyyy-mm-dd).
 * @returns The calculated age as a number.
 * @throws Error if dateOfBirth is invalid.
 */
export const calculateAge = (dateOfBirth: string): number => {
  const birthDate = new Date(dateOfBirth);
  if (isNaN(birthDate.getTime())) {
    throw new Error('Invalid date of birth');
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

/**
 * Converts a gender code to its label.
 * @param gender - The gender code (0, 1, or 2).
 * @returns The gender label as a string.
 */
export const getGenderLabel = (gender: Gender): string => {
  const genderMap: Record<Gender, string> = {
    0: 'Other',
    1: 'Male',
    2: 'Female',
  };
  return genderMap[gender];
};

/**
 * Returns a color based on academic status.
 * @param status - The academic status of the student.
 * @returns The corresponding color as a string.
 */
export const getStatusColor = (status: AcademicStatus): string => {
  const statusColorMap: Record<AcademicStatus, string> = {
    Excellent: 'gold',
    VeryGood: 'green',
    Good: 'blue',
    FairlyGood: 'cyan',
    Average: 'orange',
    Weak: 'volcano',
    Warning: 'red',
  };
  return statusColorMap[status] || 'default';
};

/**
 * Returns a color based on GPA (10-point scale).
 * @param gpa - The GPA on a 10-point scale.
 * @returns The corresponding color as a hex code.
 */
export const getGPAColor = (gpa: number): string => {
  if (gpa >= 8) return '#52c41a'; // Green - Excellent
  if (gpa >= 7) return '#1890ff'; // Blue - Good
  if (gpa >= 6) return '#faad14'; // Orange - Average
  if (gpa >= 5) return '#fa8c16'; // Dark Orange - Below Average
  return '#ff4d4f'; // Red - Poor
};

// Data validation
/**
 * Checks if an object is a valid Student.
 * @param student - The object to validate.
 * @returns True if the object is a valid Student, false otherwise.
 */
export const isValidStudent = (student: unknown): student is Student => {
  if (typeof student !== 'object' || student === null) return false;

  const s = student as Partial<Student>;
  return (
    typeof s.userName === 'string' &&
    typeof s.firstName === 'string' &&
    typeof s.lastName === 'string' &&
    typeof s.faculty === 'string' &&
    typeof s.course === 'string' &&
    typeof s.diemTB10 === 'number' &&
    typeof s.diemTB4 === 'number' &&
    typeof s.id === 'string' &&
    (s.email === null || typeof s.email === 'string') &&
    (s.avataUrl === null || typeof s.avataUrl === 'string') &&
    (s.phoneNumber === null || typeof s.phoneNumber === 'string') &&
    (s.fcmToken === null || typeof s.fcmToken === 'string') &&
    (s.className === null || typeof s.className === 'string')
  );
};

/**
 * Validates if a student's GPA is within acceptable ranges.
 * @param student - The student object to validate.
 * @returns True if the GPA is valid, false otherwise.
 */
export const hasValidGPA = (student: Pick<AverageScore, 'diemTB10' | 'diemTB4'>): boolean => {
  return student.diemTB10 >= 0 && student.diemTB10 <= 10 && student.diemTB4 >= 0 && student.diemTB4 <= 4;
};