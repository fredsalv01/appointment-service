import { CountryEnum } from "../../application/enum/CountryEnum";
import { Appointment } from "../../domain/appointment.entity";
import { AppointmentRepository } from "../../domain/appointment.repository";
import { AppointmentStatusEnum } from "../../domain/enums/appointment-enums";
import { DateTimeFormat } from "../../shared/functions/DateTimeFormat";
import { RdsClient } from "./rds.repository";

export class RdsAppointmentRepository extends RdsClient implements AppointmentRepository {
    constructor(country: CountryEnum) {
        super(country)
    }
    async save(appointment: Partial<Appointment>): Promise<void> {
        const date = DateTimeFormat();
        this.pool.query(
            `
                INSERT INTO appointments (
                    insured_id, schedule_id, country_iso, status, created_at
                ) VALUES (?, ?, ?, ?, ?)
            `,
            [
                appointment.insuredId,
                appointment.scheduleId,
                appointment.countryISO,
                appointment.status,
                date
            ]
        );
    }

    async findByInsuredId(insuredId: string): Promise<Appointment[]> {
        throw new Error('findByInsuredId is not implemented on RDS side');
    }

    updateStatus(insuredId: string, scheduleId: number, status: AppointmentStatusEnum): Promise<void> {
        throw new Error("Method not implemented.");
    }

    findById(id: string): Promise<Appointment | null> {
        throw new Error("Method not implemented.");
    }
}