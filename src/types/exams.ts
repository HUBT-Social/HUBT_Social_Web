export interface Exam {
  id?: string;
  title: string;
  description: string;
  fileName: string;
  major: string;
  createdDate: string;
  status?: 'draft' | 'approved' | 'pending';
}