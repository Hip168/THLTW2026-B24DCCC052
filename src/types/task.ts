export type TaskStatus = 'todo' | 'inprogress' | 'done';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;           // UUID duy nhất, dùng Date.now().toString() hoặc nanoid
  title: string;        // Tên task (bắt buộc)
  description?: string; // Mô tả (tuỳ chọn)
  deadline?: string;    // Định dạng 'YYYY-MM-DD' (Moment.js)
  priority: TaskPriority;
  status: TaskStatus;
  tags?: string[];      // Mảng tag tự do
  createdAt: string;    // ISO string
}
