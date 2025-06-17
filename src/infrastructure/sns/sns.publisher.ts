import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";

export abstract class SNSPublisher {
    protected readonly client: SNSClient;

    constructor() {
        this.client = new SNSClient({});
    }

    protected async publishMessage(topicArn: string, message: any, attributes: Record<string, string> = {}) {
        const messageAttributes = Object.entries(attributes).reduce(
            (acc, [key, value]) => {
                acc[key] = {
                    DataType: 'String',
                    StringValue: value
                }
                return acc;
            },
            {} as Record<string, {DataType: string; StringValue: string}>
        );

        await this.client.send(
            new PublishCommand({
                TopicArn: topicArn,
                Message: JSON.stringify(message),
                MessageAttributes: messageAttributes
            })
        )
    }
}