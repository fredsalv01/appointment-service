import Fastify from 'fastify';
import awsLambdaFastify from '@fastify/aws-lambda';
import { appointmentRoutes } from '../infrastructure/http/appointment.controller';

const app = Fastify();

await appointmentRoutes(app);

export const handler = awsLambdaFastify(app);