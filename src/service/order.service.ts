import { Prisma, Order, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { OrderStatusEnum, ValidationError, BaseModelService } from "@jiaul.islam/common.ticketing.dev";

const prisma = new PrismaClient();

export class OrderService extends BaseModelService<
    Prisma.OrderDelegate<DefaultArgs>,
    Order,
    Prisma.OrderFindUniqueArgs<DefaultArgs>,
    Prisma.OrderFindManyArgs<DefaultArgs>,
    Prisma.OrderCreateArgs<DefaultArgs>,
    Prisma.OrderUpdateArgs<DefaultArgs>,
    Prisma.OrderDeleteArgs<DefaultArgs>,
    Prisma.OrderCountArgs<DefaultArgs>,
    Prisma.OrderUpsertArgs<DefaultArgs>
> {
    protected getModel() {
        return prisma.order;
    }

    /**
     * Find all orders with optional filtering.
     */
    public async findAll(args?: Prisma.OrderFindManyArgs<DefaultArgs>): Promise<Order[]> {
        try {
            return await this.getModel().findMany(args);
        } catch (error) {
            this.handleError(error, "findAll", args);
        }
    }

    /**
     * Create a new order with validation and ticket price assignment.
     */
    public async create(args: Prisma.OrderCreateArgs<DefaultArgs>): Promise<Order> {
        try {
            const data = args.data;
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
            return await this.getModel().create({ data });
        } catch (error) {
            this.handleError(error, "create", args);
        }
    }
}