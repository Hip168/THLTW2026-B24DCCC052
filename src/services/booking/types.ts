export interface Employee {
  id: string;
  name: string;
  max_customers: number;
  working_hours: string; // e.g., "09:00-17:00"
  working_days: string[];
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface Appointment {
  id: string;
  customer_name: string;
  employee_id: string;
  service_id: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
}

export interface Review {
  id: string;
  appointment_id: string;
  rating: number;
  comment: string;
  staff_reply?: string;
}
