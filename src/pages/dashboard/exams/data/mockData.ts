import { PracticeTest, TestType } from "../../../../types/PracticeTestType";


export const mockPracticeTests: PracticeTest[] = [
  {
    id: 'test1',
    title: 'Đề ôn tập Toán Cao cấp',
    description: 'Ôn tập các khái niệm cơ bản về vi tích phân',
    type: TestType.Practice,
    fileUrl: 'https://example.com/test1.pdf',
    fileName: 'toan_cao_cap.pdf',
    problemJson: JSON.stringify({
      title: 'Bài toán vi tích phân',
      content: 'Tính đạo hàm của f(x) = x^2 + 3x + 2',
      options: ['A. 2x + 3', 'B. x + 3', 'C. 2x', 'D. 3x'],
    }),
    createdAt: '2025-05-01T10:00:00Z',
    updatedAt: '2025-05-01T10:00:00Z',
  },
  {
    id: 'test2',
    title: 'Đề ôn tập Vật lý',
    description: 'Các bài tập về động lực học',
    type: TestType.Practice,
    fileUrl: 'https://example.com/test2.pdf',
    fileName: 'vat_ly.pdf',
    problemJson: JSON.stringify({
      title: 'Bài toán động lực học',
      content: 'Tính gia tốc của vật có khối lượng 5kg với lực 20N',
      options: ['A. 4m/s^2', 'B. 5m/s^2', 'C. 3m/s^2', 'D. 2m/s^2'],
    }),
    createdAt: '2025-05-02T12:00:00Z',
    updatedAt: '2025-05-02T12:00:00Z',
  },
];