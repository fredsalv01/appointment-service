import { FastifyInstance } from "fastify";
import { DynamoDbAppointmentRepository } from "../dynamodb/appointment.repository";
import { AppointmentSNSPublisher } from "../sns/appointment.publisher";
import { CreateAppointmentUseCase } from "../../application/createAppointment.use-case";
import { GetAppointmentsByInsuredIdUseCase } from "../../application/getAppointment.use-case";
import { CreateAppointmentRequest } from "../../application/dtos/create-appointment-request";
import { RESPONSE_APPOINTMENT } from "./enum/response-message.enum";

export async function appointmentRoutes(fastify: FastifyInstance) {
    const repository = new DynamoDbAppointmentRepository();
    const publisher = new AppointmentSNSPublisher();

    const createUseCase = new CreateAppointmentUseCase(repository);
    const getUseCase = new GetAppointmentsByInsuredIdUseCase(repository);

    fastify.post('/appointments', async (request, reply) => {
        try {
            const { insuredId, date, countryISO } = request.body as CreateAppointmentRequest;
            const appointment = await createUseCase.execute({insuredId, date, countryISO});
            await publisher.publish(appointment);
            return reply.code(201).send({ message: RESPONSE_APPOINTMENT.CREATE_APPOINTMENT_MESSAGE, data: {
                appointment_id: appointment.id,
                appointment_insuredId: appointment.insuredId,
                appointment_status: appointment.status
            }});
        } catch (error) {
            console.log('🚀 Error al ejecutar el endpoint /appointments', error);
        }
    });

    fastify.get('/appointments/:insuredId', async (request, reply) => {
        try {
            const {insuredId} = request.params as { insuredId: string };
            const appointments = await getUseCase.execute(insuredId);

            return reply.code(200).send({
                message: RESPONSE_APPOINTMENT.GET_APPOINTMENT_MESSAGE,
                data: appointments.map(a => a.toPrimitives())
            });
        } catch (error) {
            console.log('🚀 Error al ejecutar el endpoint /appointments/:insuredId', error);
        }
    })
}