import dotenv from "dotenv";

dotenv.config()

import { app, kafkaOrderProducer, kafkaOrderConsumer } from "./app";


const checkKafkaEnvVariables = () => {
    // check if kafka variables are set
    if (!process.env.KAFKA_BOOTSTRAP_SERVERS) {
        throw new Error('KAFKA_BOOTSTRAP_SERVERS must be defined');
    }
    if (!process.env.KAFKA_SASL_PROTOCOL) {
        throw new Error('KAFKA_SASL_PROTOCOL must be defined');
    }
    if (!process.env.KAFKA_SASL_MECHANISM) {
        throw new Error('KAFKA_SASL_MECHANISM must be defined');
    }
    if (!process.env.KAFKA_SASL_USERNAME) {
        throw new Error('KAFKA_SASL_USERNAME must be defined');
    }
    if (!process.env.KAFKA_SASL_PASSWORD) {
        throw new Error('KAFKA_SASL_PASSWORD must be defined');
    }
    if (!process.env.KAFKA_CLIENT_ID) {
        throw new Error('KAFKA_CLIENT_ID must be defined');
    }
}
const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL must be defined');
    }

    checkKafkaEnvVariables();
    await kafkaOrderProducer.connect();
    await kafkaOrderConsumer.connect();
    // consume
    await kafkaOrderConsumer.consume().catch(err => {
        console.error(`Error consuming Kafka messages: ${err}`);
    });
    app.listen(process.env.SERVER_PORT || 4002, () => {
        console.log(`Order Service is running on port ${process.env.SERVER_PORT || 4002}`);
    });
}

start(); // eslint-disable-line

// Graceful shutdown
const gracefulShutdown = async () => {
    try {
        await kafkaOrderProducer.disconnect();
        console.log(`Kafka producer disconnected`);
        await kafkaOrderConsumer.disconnect();
        console.log(`Kafka consumer disconnected`);
    } catch (error) {
        console.error(`Error disconnecting Kafka producer: ${error}`);
    } finally {
        process.exit(0);
    }
}

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
