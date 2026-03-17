import { Employee, Service, Appointment, Review, AppointmentStatus } from './types';

const STORAGE_KEYS = {
  EMPLOYEES: 'booking_employees',
  SERVICES: 'booking_services',
  APPOINTMENTS: 'booking_appointments',
  REVIEWS: 'booking_reviews',
};

class BookingRepository {
  private getStorage<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private setStorage<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getEmployees(): Employee[] {
    const employees = this.getStorage<Employee>(STORAGE_KEYS.EMPLOYEES);
    if (employees.length === 0) {
      const initial = [
        { id: 'emp-1', name: 'Nguyễn Văn A', max_customers: 2, working_hours: '08:00-17:00', working_days: ['Monday', 'Wednesday', 'Friday'] },
        { id: 'emp-2', name: 'Trần Thị B', max_customers: 5, working_hours: '09:00-18:00', working_days: ['Tuesday', 'Thursday', 'Saturday'] },
      ];
      this.setStorage(STORAGE_KEYS.EMPLOYEES, initial);
      return initial;
    }
    return employees;
  }

  addEmployee(employee: Omit<Employee, 'id'>): Employee {
    const employees = this.getEmployees();
    const newEmployee = { ...employee, id: crypto.randomUUID() };
    this.setStorage(STORAGE_KEYS.EMPLOYEES, [...employees, newEmployee]);
    return newEmployee;
  }

  updateEmployee(id: string, data: Partial<Employee>): void {
    const employees = this.getEmployees();
    const updated = employees.map(e => e.id === id ? { ...e, ...data } : e);
    this.setStorage(STORAGE_KEYS.EMPLOYEES, updated);
  }

  deleteEmployee(id: string): void {
    const employees = this.getEmployees();
    this.setStorage(STORAGE_KEYS.EMPLOYEES, employees.filter(e => e.id !== id));
  }

  getServices(): Service[] {
    const services = this.getStorage<Service>(STORAGE_KEYS.SERVICES);
    if (services.length === 0) {
      const initial = [
        { id: 'ser-1', name: 'Gội đầu dưỡng sinh', price: 150000, duration: 45 },
        { id: 'ser-2', name: 'Cắt tóc chuyên nghiệp', price: 200000, duration: 30 },
      ];
      this.setStorage(STORAGE_KEYS.SERVICES, initial);
      return initial;
    }
    return services;
  }

  addService(service: Omit<Service, 'id'>): Service {
    const services = this.getServices();
    const newService = { ...service, id: crypto.randomUUID() };
    this.setStorage(STORAGE_KEYS.SERVICES, [...services, newService]);
    return newService;
  }

  updateService(id: string, data: Partial<Service>): void {
    const services = this.getServices();
    const updated = services.map(s => s.id === id ? { ...s, ...data } : s);
    this.setStorage(STORAGE_KEYS.SERVICES, updated);
  }

  deleteService(id: string): void {
    const services = this.getServices();
    this.setStorage(STORAGE_KEYS.SERVICES, services.filter(s => s.id !== id));
  }

  getAppointments(): Appointment[] {
    return this.getStorage<Appointment>(STORAGE_KEYS.APPOINTMENTS);
  }

  addAppointment(data: Omit<Appointment, 'id' | 'end_time' | 'status'>): Appointment {
    const employees = this.getEmployees();
    const services = this.getServices();
    const appointments = this.getAppointments();
    const employee = employees.find(e => e.id === data.employee_id);
    const service = services.find(s => s.id === data.service_id);

    if (!employee || !service) throw new Error('Dữ liệu không hợp lệ');

    const appointmentDate = new Date(data.start_time);
    const dayName = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' });
    if (!employee.working_days.includes(dayName)) throw new Error(`Nhân viên không làm việc vào ngày ${dayName}`);

    const [startWork, endWork] = employee.working_hours.split('-');
    const [startH, startM] = startWork.split(':').map(Number);
    const [endH, endM] = endWork.split(':').map(Number);
    const appH = appointmentDate.getHours();
    const appM = appointmentDate.getMinutes();

    const appTimeVal = appH * 60 + appM;
    const startWorkVal = startH * 60 + startM;
    const endWorkVal = endH * 60 + endM;

    if (appTimeVal < startWorkVal || appTimeVal > endWorkVal) throw new Error(`Giờ đặt lịch ngoài khung giờ làm việc (${employee.working_hours})`);

    const start = appointmentDate.getTime();
    const end = start + service.duration * 60000;
    const overlapping = appointments.some(app => {
      if (app.employee_id !== data.employee_id || app.status === 'CANCELLED') return false;
      return (start < new Date(app.end_time).getTime() && end > new Date(app.start_time).getTime());
    });
    if (overlapping) throw new Error('Trùng lịch với lịch hẹn khác');

    const startOfDay = new Date(data.start_time);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(data.start_time);
    endOfDay.setHours(23, 59, 59, 999);
    const dailyCount = appointments.filter(app => 
      app.employee_id === data.employee_id && app.status !== 'CANCELLED' &&
      new Date(app.start_time) >= startOfDay && new Date(app.start_time) <= endOfDay
    ).length;
    if (dailyCount >= employee.max_customers) throw new Error('Đã đạt giới hạn số khách trong ngày');

    const newAppointment: Appointment = { ...data, id: crypto.randomUUID(), end_time: new Date(end).toISOString(), status: 'PENDING' };
    this.setStorage(STORAGE_KEYS.APPOINTMENTS, [...appointments, newAppointment]);
    return newAppointment;
  }

  updateAppointmentStatus(id: string, status: AppointmentStatus): void {
    const appointments = this.getAppointments();
    this.setStorage(STORAGE_KEYS.APPOINTMENTS, appointments.map(app => app.id === id ? { ...app, status } : app));
  }

  getReviews(): Review[] {
    return this.getStorage<Review>(STORAGE_KEYS.REVIEWS);
  }

  addReview(review: Omit<Review, 'id'>): void {
    const appointments = this.getAppointments();
    if (appointments.find(a => a.id === review.appointment_id)?.status !== 'COMPLETED') throw new Error('Chỉ có thể đánh giá khi hoàn thành');
    const reviews = this.getReviews();
    this.setStorage(STORAGE_KEYS.REVIEWS, [...reviews, { ...review, id: crypto.randomUUID() }]);
  }

  addStaffReply(reviewId: string, reply: string): void {
    const reviews = this.getReviews();
    this.setStorage(STORAGE_KEYS.REVIEWS, reviews.map(r => r.id === reviewId ? { ...r, staff_reply: reply } : r));
  }

  getEmployeeRating(employeeId: string): number {
    const reviews = this.getReviews();
    const appointments = this.getAppointments();
    const employeeReviews = reviews.filter(rev => appointments.find(a => a.id === rev.appointment_id)?.employee_id === employeeId);
    if (employeeReviews.length === 0) return 0;
    return Number((employeeReviews.reduce((sum, r) => sum + r.rating, 0) / employeeReviews.length).toFixed(1));
  }

  getStatistics() {
    const appointments = this.getAppointments();
    const services = this.getServices();
    const completed = appointments.filter(a => a.status === 'COMPLETED');
    const totalRevenue = completed.reduce((sum, app) => sum + (services.find(s => s.id === app.service_id)?.price || 0), 0);
    return { totalAppointments: appointments.length, completedAppointments: completed.length, totalRevenue };
  }
}

export default new BookingRepository();
