import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { Appointment } from "../../domain/appointment.entity";
import { AppointmentRepository } from "../../domain/appointment.repository";
import { DynamoDBRepository } from "./dynamodb.repository";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { AppointmentStatusEnum } from "../../domain/enums/appointment-enums";

export class DynamoDbAppointmentRepository extends DynamoDBRepository implements AppointmentRepository {
    constructor() {
        super(process.env.APPOINTMENTS_TABLE || 'Appointments');
    }
    
    async save(appointment: Appointment): Promise<void> {
        await this.client.send(
            new PutCommand({
                TableName: this.tableName,
                Item: appointment.toPrimitives()
            })
        )
    }

    async findByInsuredId(insuredId: string): Promise<Appointment[]> {
        const result = await this.client.send(
        new QueryCommand({
            TableName: this.tableName,
            IndexName: 'insuredId-index',
            KeyConditionExpression: 'insuredId = :insuredId',
            ExpressionAttributeValues: {
                ':insuredId': { S: insuredId }
            }
        })
        );
        return (
            result.Items?.map((item) => {
                const unmarshallItem = unmarshall(item) as Appointment;
                return Appointment.fromPrimitives(unmarshallItem)
            }) || []
        );
    }

    async findById(id: string): Promise<Appointment | null> {
        const result = await this.client.send(
        new GetCommand({
            TableName: this.tableName,
            Key: { id }
        })
        );

        if (!result.Item) return null;

        return Appointment.fromPrimitives(result.Item as any);
    }

    async updateStatus(insuredId: string, scheduleId: number, status: AppointmentStatusEnum): Promise<void> {
        await this.client.send(
            new UpdateCommand({
                TableName: this.tableName,
                Key: { 
                    insuredId: { S: insuredId },
                    scheduleId: { N: scheduleId.toString() },
                },
                UpdateExpression: 'SET #s = :status',
                ExpressionAttributeNames: {
                    '#s': 'status'
                },
                ExpressionAttributeValues: {
                    ':status': { S: status }
                }
            })
        );
    }


}