import { Appointment } from "./appointment.entity";
import { AppointmentStatusEnum } from "./enums/appointment-enums";

export interface AppointmentRepository {
  save(appointment: Appointment): Promise<void>;
  findByInsuredId(insuredId: string): Promise<Appointment[]>;
  updateStatus(insuredId: string, scheduleId: number,status: AppointmentStatusEnum): Promise<void>;
  findById(id: string): Promise<Appointment | null>;
}