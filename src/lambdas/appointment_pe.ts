import { SQSEvent } from "aws-lambda";
import { RdsAppointmentRepository } from "../infrastructure/rds/rds-appointment.repository";
import { Appointment } from "../domain/appointment.entity";
import { AppointmentStatusEnum } from "../domain/enums/appointment-enums";
import { CountryEnum } from "../application/enum/CountryEnum";
import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";

export const handler = async (event: SQSEvent) => {
    const repository = new RdsAppointmentRepository(CountryEnum.PE);

    for (const record of event.Records) {
        try {
            const body = JSON.parse(record.body);
            const appointment: Partial<Appointment> = {
                insuredId: body.insuredId,
                scheduleId: body.scheduleId,
                countryISO: body.countryISO,
                status: body.status ?? AppointmentStatusEnum.PENDING
            };
            await repository.save(appointment);
            console.log(`✅ Saved appointment for ${appointment.insuredId}`);
            const eventBridget = new EventBridgeClient({});
            await eventBridget.send(new PutEventsCommand({
                Entries: [
                    {
                        Source: 'appointment.service',
                        DetailType: 'AppointmentConfirmed',
                        EventBusName: 'default',
                        Detail: JSON.stringify({
                            insuredId: appointment.insuredId,
                            scheduleId: appointment.scheduleId,
                            countryISO: appointment.countryISO,
                        }),
                    },
                ],
            }));
        } catch (error) {
            throw new Error(`Fallo el proceso del mensaje: `+ error);
        }
    }
}