export enum TestType {
  Practice = 'practice',
  Exam = 'exam',
}

export interface PracticeTest {
  id: string;
  title: string;
  description: string;
  type: TestType;
  fileUrl: string;
  fileName: string;
  problemJson: string; // Chuỗi JSON của đề bài
  createdAt: string;
  updatedAt: string;
}

export interface PracticeTestFormValues {
  title: string;
  description: string;
  type: TestType;
  fileUrl: string;
  fileName: string;
  problemJson: string;
}