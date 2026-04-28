export interface ExerciseRecord {
  id: string;
  name: string;
  muscleGroup: string;
  level: 'Dễ' | 'Trung bình' | 'Khó';
  caloriesPerHour: number;
  instructions: string;
}
