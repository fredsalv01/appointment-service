
import { Appointment } from '../domain/appointment.entity';
import { AppointmentRepository } from '../domain/appointment.repository';

export class GetAppointmentsByInsuredIdUseCase {
  constructor(private readonly repository: AppointmentRepository) {}

  async execute(insuredId: string): Promise<Appointment[]> {
    return await this.repository.findByInsuredId(insuredId);
  }
}