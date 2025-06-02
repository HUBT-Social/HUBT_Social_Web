import { PracticeTestFormValues, TestType } from '../types/PracticeTestType';

export const uploadTestFile = async (file: File): Promise<Partial<PracticeTestFormValues>> => {
  // Giả lập API upload
  await new Promise(resolve => setTimeout(resolve, 1000)); // Delay 1s
  return {
    title: file.name.replace('.pdf', ''),
    description: `Mô tả cho ${file.name}`,
    type: TestType.Practice,
    fileUrl: `https://example.com/uploads/${file.name}`,
    fileName: file.name,
    problemJson: JSON.stringify({
      title: `Bài toán từ ${file.name}`,
      content: 'Nội dung đề bài được trích xuất...',
      options: ['A', 'B', 'C', 'D'],
    }),
  };
};