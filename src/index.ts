import dotenv from 'dotenv';

dotenv.config();

import { app, kafkaOrderProducer, kafkaOrderConsumer } from './app';
import './cron';

/**
 * Starts the Order Service application.
 * Ensures required environment variables are set and connects to Kafka.
 */

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be defined');
  }

  try {
    // producer
    await kafkaOrderProducer.connect();
    // consumer
    await kafkaOrderConsumer.connect();
    await kafkaOrderConsumer.subscribe();
    await kafkaOrderConsumer.consume();
  } catch (error) {
    console.error(`Error connecting to Kafka: ${error}`);
    process.exit(1);
  }

  app.listen(process.env.SERVER_PORT || 4002, () => {
    console.log(`Order Service is running on port ${process.env.SERVER_PORT || 4002}`);
  });
};

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
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
