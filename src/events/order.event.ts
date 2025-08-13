import { AbstractKafkaEventProducer, OrderCreatedUpdatedEvent, Subject } from "@jiaul.islam/common.ticketing.dev";
import { kafkaOrderProducer } from "../app";


export class OrderCreatedEventProducer extends AbstractKafkaEventProducer<OrderCreatedUpdatedEvent> {
    readonly topic: Subject.ORDER_CREATED = Subject.ORDER_CREATED;

    constructor() {
        super(kafkaOrderProducer);
    }
}


export class OrderUpdatedEventProducer extends AbstractKafkaEventProducer<OrderCreatedUpdatedEvent> {
    readonly topic: Subject.ORDER_UPDATED = Subject.ORDER_UPDATED;

    constructor() {
        super(kafkaOrderProducer);
    }
}
