import { Appointment } from "../../domain/appointment.entity";
import { SNSPublisher } from "./sns.publisher";

export class AppointmentSNSPublisher extends SNSPublisher {
    private readonly topicMap: Record<string, string>;

    constructor(){
        super();

        this.topicMap = {
            PE: process.env.SNS_TOPIC_PE!,
            CL: process.env.SNS_TOPIC_CL!,
        }
    }

    async publish(appointment: Appointment): Promise<void> {
        const topicArn = this.topicMap[appointment.countryISO];
        if(!topicArn) {
            throw new Error(`No hay topic SNS configurado para el país: ${appointment.countryISO}`);
        }

        await this.publishMessage(topicArn, appointment.toPrimitives(), {
            countryISO: appointment.countryISO
        })
    }
}