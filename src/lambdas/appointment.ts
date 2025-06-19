import Fastify from 'fastify';
import awsLambdaFastify from '@fastify/aws-lambda';
import { appointmentRoutes } from '../infrastructure/http/appointment.controller';
import { DynamoDbAppointmentRepository } from '../infrastructure/dynamodb/appointment.repository';
import { AppointmentStatusEnum } from '../domain/enums/appointment-enums';

const app = Fastify();

await appointmentRoutes(app);

const proxy = awsLambdaFastify(app);

export const handler = async (event: any, context: any) => {
    if(event.Records && event.Records[0].eventSource === 'aws:sqs') {
        for(const record of event.Records) {
            try {
                const body = JSON.parse(record.body);
                const { insuredId, scheduleId } = body.detail;
                console.log(`Actualizando estado a completado: ${insuredId}, ${scheduleId}`);
                const repository = new DynamoDbAppointmentRepository();
                await repository.updateStatus(insuredId, scheduleId, AppointmentStatusEnum.COMPLETED);
            } catch (error) {
                console.log(`Error procesando record SQS: `+ error)
            }
        }

        return {
            statusCode: 200,
            body: 'mensaje de sqs procesado',
        };
    }

    return proxy(event, context);
};