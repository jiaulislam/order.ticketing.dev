import { BaseKafka } from "@jiaul.islam/common.ticketing.dev";

const kafkaConfig = {
    "bootstrap.servers": process.env.KAFKA_BOOTSTRAP_SERVERS!,
    "security.protocol": process.env.KAFKA_SASL_PROTOCOL!,
    "sasl.mechanism": process.env.KAFKA_SASL_MECHANISM!,
    "sasl.username": process.env.KAFKA_SASL_USERNAME!,
    "sasl.password": process.env.KAFKA_SASL_PASSWORD!,
    "socket.timeout.ms": 45000,
    "client.id": process.env.KAFKA_CLIENT_ID!,
}

export class OrderKafkaService extends BaseKafka {
    readonly clusterName = "ticketing-cluster";

    constructor() {
        super(kafkaConfig);
    }
}
