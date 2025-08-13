import { KafkaConfig } from "kafkajs";
import { AbstractKafkaConsumer, AbstractKafkaProducer } from "@jiaul.islam/common.ticketing.dev";
import { Subject } from "@jiaul.islam/common.ticketing.dev";
import { topicHandlers } from "./service";

const kafkaConfig: KafkaConfig = {
    clientId: process.env.KAFKA_CLIENT_ID!,
    brokers: [process.env.KAFKA_BOOTSTRAP_SERVERS!],
};

export class OrderKafkaProducer extends AbstractKafkaProducer {
    readonly clusterName = "ticketing-cluster";

    constructor() {
        super(kafkaConfig);
    }
}

export class OrderKafkaConsumer extends AbstractKafkaConsumer {
    readonly clusterName = "ticketing-cluster";

    constructor() {
        super(kafkaConfig, [Subject.TICKET_CREATED, Subject.TICKET_UPDATED]);
    }

    async onMessage(topic: Subject, message: any): Promise<void> {
        const handler = topicHandlers[topic];
        if (handler) {
            await handler(message);
        } else {
            console.warn(`No handler found for topic ${topic}`);
        }
    }
}