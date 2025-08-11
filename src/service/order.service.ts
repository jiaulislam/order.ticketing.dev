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
        // set the ticket price for the totalAmount
        const ticketId = (data.ticket as { connect: { id: number } }).connect.id;
        const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
        if (!ticket) {
            throw new ValidationError("Invalid ticket ID");
        }
        data.totalAmount = ticket.price;
        return prisma.order.create({ data });
    }

}