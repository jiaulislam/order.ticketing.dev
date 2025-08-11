import { Prisma, Order, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { OrderStatusEnum, ValidationError } from "@jiaul.islam/common.ticketing.dev";

const prisma = new PrismaClient();
export class OrderService {

    async findAll(args?: Prisma.OrderFindManyArgs<DefaultArgs>): Promise<Order[]> {
        return prisma.order.findMany(args);
    }

    async create(data: Prisma.OrderCreateInput): Promise<Order> {
        if (data.totalAmount < 0) {
            throw new ValidationError("Invalid order amount");
        }
        if (data.status !== OrderStatusEnum.PENDING) {
            throw new ValidationError(`Invalid order status: ${data.status}`);
        }
        return prisma.order.create({ data });
    }

}