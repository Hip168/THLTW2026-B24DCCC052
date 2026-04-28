export interface GoalRecord {
  id: string;
  name: string;
  type: string;
  currentValue: number;
  targetValue: number;
  deadline: string;
  status: 'active' | 'completed' | 'failed';
}
