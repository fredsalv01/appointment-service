import { AppointmentStatusEnum } from "./enums/appointment-enums";

export class Appointment {
    constructor(
        public readonly id: string,
        public readonly insuredId: string,
        public readonly scheduleId: number,
        public readonly date: string,
        public status: AppointmentStatusEnum = AppointmentStatusEnum.PENDING,
        public readonly countryISO: string
    ){}

    markAsCompleted(): void {
        this.status = AppointmentStatusEnum.COMPLETED;
    }

    toPrimitives() {
        return {
            id: this.id,
            insuredId: this.insuredId,
            scheduleId: this.scheduleId,
            date: this.date,
            status: this.status,
            countryISO: this.countryISO
        };
    }

    static fromPrimitives(data: {
        id: string;
        insuredId: string;
        scheduleId: number;
        date: string;
        status: AppointmentStatusEnum;
        countryISO: string;
    }): Appointment {
        return new Appointment(
            data.id,
            data.insuredId,
            data.scheduleId,
            data.date,
            data.status,
            data.countryISO
        );
    }
}