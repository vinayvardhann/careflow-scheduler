export type Priority = 'emergency' | 'high' | 'medium' | 'normal';
export type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';
export type UserRole = 'admin' | 'doctor' | 'patient';

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  avatar: string;
  availableSlots: TimeSlot[];
  avgConsultationTime: number; // minutes
}

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientAge: number;
  doctorId: string;
  doctorName: string;
  specialization: string;
  date: string;
  startTime: string;
  endTime: string;
  priority: Priority;
  status: AppointmentStatus;
  reason: string;
}

export interface DashboardStats {
  totalAppointments: number;
  todayAppointments: number;
  avgWaitTime: number;
  completionRate: number;
}

export const MOCK_DOCTORS: Doctor[] = [
  { id: 'd1', name: 'Dr. Sarah Chen', specialization: 'Cardiology', avatar: 'SC', availableSlots: [], avgConsultationTime: 20 },
  { id: 'd2', name: 'Dr. James Wilson', specialization: 'Orthopedics', avatar: 'JW', availableSlots: [], avgConsultationTime: 25 },
  { id: 'd3', name: 'Dr. Priya Patel', specialization: 'Dermatology', avatar: 'PP', availableSlots: [], avgConsultationTime: 15 },
  { id: 'd4', name: 'Dr. Michael Brooks', specialization: 'Neurology', avatar: 'MB', availableSlots: [], avgConsultationTime: 30 },
  { id: 'd5', name: 'Dr. Lisa Rodriguez', specialization: 'Pediatrics', avatar: 'LR', availableSlots: [], avgConsultationTime: 20 },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'a1', patientName: 'John Martinez', patientAge: 45, doctorId: 'd1', doctorName: 'Dr. Sarah Chen', specialization: 'Cardiology', date: '2026-02-22', startTime: '09:00', endTime: '09:20', priority: 'emergency', status: 'confirmed', reason: 'Chest pain' },
  { id: 'a2', patientName: 'Emily Watson', patientAge: 72, doctorId: 'd2', doctorName: 'Dr. James Wilson', specialization: 'Orthopedics', date: '2026-02-22', startTime: '09:30', endTime: '09:55', priority: 'high', status: 'confirmed', reason: 'Hip replacement follow-up' },
  { id: 'a3', patientName: 'David Kim', patientAge: 34, doctorId: 'd3', doctorName: 'Dr. Priya Patel', specialization: 'Dermatology', date: '2026-02-22', startTime: '10:00', endTime: '10:15', priority: 'normal', status: 'pending', reason: 'Skin rash evaluation' },
  { id: 'a4', patientName: 'Maria Garcia', patientAge: 68, doctorId: 'd4', doctorName: 'Dr. Michael Brooks', specialization: 'Neurology', date: '2026-02-22', startTime: '10:30', endTime: '11:00', priority: 'high', status: 'confirmed', reason: 'Migraine consultation' },
  { id: 'a5', patientName: 'Alex Thompson', patientAge: 28, doctorId: 'd5', doctorName: 'Dr. Lisa Rodriguez', specialization: 'Pediatrics', date: '2026-02-22', startTime: '11:00', endTime: '11:20', priority: 'normal', status: 'completed', reason: 'Annual checkup' },
  { id: 'a6', patientName: 'Sophie Brown', patientAge: 55, doctorId: 'd1', doctorName: 'Dr. Sarah Chen', specialization: 'Cardiology', date: '2026-02-22', startTime: '11:30', endTime: '11:50', priority: 'medium', status: 'pending', reason: 'Blood pressure review' },
  { id: 'a7', patientName: 'Robert Lee', patientAge: 41, doctorId: 'd3', doctorName: 'Dr. Priya Patel', specialization: 'Dermatology', date: '2026-02-23', startTime: '09:00', endTime: '09:15', priority: 'normal', status: 'confirmed', reason: 'Mole check' },
  { id: 'a8', patientName: 'Nina Patel', patientAge: 80, doctorId: 'd4', doctorName: 'Dr. Michael Brooks', specialization: 'Neurology', date: '2026-02-23', startTime: '09:30', endTime: '10:00', priority: 'emergency', status: 'confirmed', reason: 'Stroke symptoms' },
];

export const MOCK_STATS: DashboardStats = {
  totalAppointments: 156,
  todayAppointments: 24,
  avgWaitTime: 12,
  completionRate: 94.5,
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  emergency: 'Emergency',
  high: 'High',
  medium: 'Medium',
  normal: 'Normal',
};

export const STATUS_LABELS: Record<AppointmentStatus, string> = {
  confirmed: 'Confirmed',
  pending: 'Pending',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '13:00', '13:30', '14:00', '14:30', '15:00',
  '15:30', '16:00', '16:30', '17:00',
];
