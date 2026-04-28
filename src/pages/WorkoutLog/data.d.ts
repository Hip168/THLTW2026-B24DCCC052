export interface WorkoutRecord {
  id: string;
  date: string;
  type: string;
  duration: number;
  calories: number;
  note?: string;
  status: 'completed' | 'missed';
}
