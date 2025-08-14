import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUserMiddleware, errorHandlerMiddleware } from '@jiaul.islam/common.ticketing.dev';
import { OrderKafkaConsumer, OrderKafkaProducer } from './kafka';

// routes
import { orderRouter } from './routes';

const app = express();
app.use(json());
app.set('trust proxy', true);
app.use(
  cookieSession({ name: 'session', signed: false, secure: process.env.NODE_ENV === 'production' }),
);
app.use(currentUserMiddleware);

// inject routes
app.use('/api/v1/orders', orderRouter);

// middleware
app.use(errorHandlerMiddleware);

// kafka singleton instance
const kafkaOrderProducer = new OrderKafkaProducer();
const kafkaOrderConsumer = new OrderKafkaConsumer();

export { app, kafkaOrderProducer, kafkaOrderConsumer };
