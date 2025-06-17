import { Appointment } from "../domain/appointment.entity";
import {AppointmentRepository} from '../domain/appointment.repository';
import {v4 as uuidv4} from 'uuid';
import { CreateAppointmentRequest } from "./dtos/create-appointment-request";
import { AppointmentStatusEnum } from "../domain/enums/appointment-enums";

export class CreateAppointmentUseCase {
    constructor(private readonly repository: AppointmentRepository) {}

    async execute(input: CreateAppointmentRequest): Promise<Appointment> {
        const appointment = new Appointment(
            uuidv4(),
            input.insuredId,
            input.scheduleId,
            input.date,
            AppointmentStatusEnum.PENDING,
            input.countryISO
        )

        await this.repository.save(appointment);
        return appointment;
    }
}