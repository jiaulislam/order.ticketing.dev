import { AbstractKafkaConsumer, AbstractKafkaProducer } from "@jiaul.islam/common.ticketing.dev";
import { ConsumerGlobalAndTopicConfig, ProducerConstructorConfig } from "@confluentinc/kafka-javascript/types/kafkajs";
import { Subject } from "@jiaul.islam/common.ticketing.dev";
import topicHandlers from "./service/event-dispatch.service";

const kafkaProducerConfig: ProducerConstructorConfig = {
    "bootstrap.servers": process.env.KAFKA_BOOTSTRAP_SERVERS!,
    "security.protocol": 'sasl_ssl',
    "sasl.mechanism": process.env.KAFKA_SASL_MECHANISM!,
    "sasl.username": process.env.KAFKA_SASL_USERNAME!,
    "sasl.password": process.env.KAFKA_SASL_PASSWORD!,
    "socket.timeout.ms": 45000,
    "client.id": process.env.KAFKA_CLIENT_ID!,
};

const kafkaConsumerConfig: ConsumerGlobalAndTopicConfig = {
    "bootstrap.servers": process.env.KAFKA_BOOTSTRAP_SERVERS!,
    "security.protocol": 'sasl_ssl',
    "sasl.mechanism": process.env.KAFKA_SASL_MECHANISM!,
    "sasl.username": process.env.KAFKA_SASL_USERNAME!,
    "sasl.password": process.env.KAFKA_SASL_PASSWORD!,
    "socket.timeout.ms": 45000,
    "client.id": process.env.KAFKA_CLIENT_ID!,
    "group.id": process.env.KAFKA_GROUP_ID!,
};

export class OrderKafkaProducer extends AbstractKafkaProducer {
    readonly clusterName = "ticketing-cluster";

    constructor() {
        super(kafkaProducerConfig);
    }
}



export class OrderKafkaConsumer extends AbstractKafkaConsumer {
    readonly clusterName = "ticketing-cluster";

    constructor() {
        super(kafkaConsumerConfig, [Subject.TICKET_CREATED, Subject.TICKET_UPDATED]);
    }

    async onMessage(topic: string, message: any): Promise<void> {
        const handler = topicHandlers[topic];
        if (handler) {
            console.log(`Received message on topic ${topic}:`, message);
            await handler(message);
        } else {
            console.warn(`No handler found for topic ${topic}`);
        }
    }
}