import { Appointment } from "./appointment.entity";

export interface AppointmentRepository {
  save(appointment: Appointment): Promise<void>;
  findByInsuredId(insuredId: string): Promise<Appointment[]>;
  updateStatus(id: string, status: 'pending' | 'completed'): Promise<void>;
  findById(id: string): Promise<Appointment | null>;
}