import { FastifyInstance } from "fastify";
import { DynamoDbAppointmentRepository } from "../dynamodb/appointment.repository";
import { AppointmentSNSPublisher } from "../sns/appointment.publisher";
import { CreateAppointmentUseCase } from "../../application/createAppointment.use-case";
import { GetAppointmentsByInsuredIdUseCase } from "../../application/getAppointment.use-case";
import { CreateAppointmentRequest } from "../../application/dtos/create-appointment-request";
import { RESPONSE_APPOINTMENT } from "./enum/response-message.enum";
import { createAppointmentSchema } from "./validator/create-appointment.schema";
import { z } from "zod";

export async function appointmentRoutes(fastify: FastifyInstance) {
    const repository = new DynamoDbAppointmentRepository();
    const publisher = new AppointmentSNSPublisher();

    const createUseCase = new CreateAppointmentUseCase(repository);
    const getUseCase = new GetAppointmentsByInsuredIdUseCase(repository);

    fastify.post('/appointments', async (request, reply) => {
        try {
            const parsed = createAppointmentSchema.parse(request.body);
            const dto: CreateAppointmentRequest = parsed;
            const appointment = await createUseCase.execute(dto);
            await publisher.publish(appointment);
            return reply.code(201).send({ message: RESPONSE_APPOINTMENT.CREATE_APPOINTMENT_MESSAGE, data: {
                appointment_id: appointment.id,
                appointment_insuredId: appointment.insuredId,
                appointment_status: appointment.status
            }});
        } catch (error) {
            if (error instanceof z.ZodError) {
                return reply.code(400).send({ error: error.flatten() });
            }
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