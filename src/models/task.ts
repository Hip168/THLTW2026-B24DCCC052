// src/models/task.ts
import { useState, useCallback } from 'react';
import { Task, TaskStatus } from '@/types/task';

const STORAGE_KEY = 'th09_tasks';

// Dữ liệu mẫu để khởi tạo lần đầu (nếu localStorage trống)
const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Thiết kế UI Kanban Board',
    description: 'Vẽ wireframe và thiết kế giao diện',
    deadline: '2026-05-10',
    priority: 'high',
    status: 'done',
    tags: ['design', 'ui'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Tích hợp react-beautiful-dnd',
    description: 'Cài đặt và cấu hình kéo thả giữa các cột',
    deadline: '2026-05-12',
    priority: 'high',
    status: 'inprogress',
    tags: ['frontend', 'dnd'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Viết tài liệu hướng dẫn',
    description: 'README và hướng dẫn sử dụng cho người dùng',
    deadline: '2026-05-08',
    priority: 'low',
    status: 'todo',
    tags: ['docs'],
    createdAt: new Date().toISOString(),
  },
];

function loadFromStorage(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_TASKS;
}

function saveToStorage(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export default function useTaskModel() {
  const [tasks, setTasks] = useState<Task[]>(loadFromStorage);

  const syncAndSet = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
    saveToStorage(newTasks);
  }, []);

  // Thêm task mới
  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    syncAndSet([...tasks, newTask]);
  }, [tasks, syncAndSet]);

  // Chỉnh sửa task
  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    syncAndSet(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
  }, [tasks, syncAndSet]);

  // Xoá task
  const deleteTask = useCallback((id: string) => {
    syncAndSet(tasks.filter(t => t.id !== id));
  }, [tasks, syncAndSet]);

  // Cập nhật trạng thái (dùng cho kéo thả Kanban)
  const moveTask = useCallback((taskId: string, newStatus: TaskStatus) => {
    syncAndSet(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  }, [tasks, syncAndSet]);

  // Thống kê tính toán
  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === 'done').length,
    overdue: tasks.filter(t => {
      if (!t.deadline || t.status === 'done') return false;
      return new Date(t.deadline) < new Date();
    }).length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inprogress: tasks.filter(t => t.status === 'inprogress').length,
  };

  return { tasks, stats, addTask, updateTask, deleteTask, moveTask };
}
