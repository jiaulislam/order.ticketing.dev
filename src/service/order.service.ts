import { Prisma, Order, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { OrderStatusEnum, ValidationError, BaseModelService } from "@jiaul.islam/common.ticketing.dev";

const prisma = new PrismaClient();

/**
 * Service class for managing Order entities using Prisma ORM.
 *
 * Extends the BaseModelService to provide type-safe CRUD operations, error handling,
 * and business logic for the Order model. This service is enterprise-ready and can be
 * further extended for custom business requirements.
 *
 * @extends BaseModelService<Prisma.OrderDelegate<DefaultArgs>, Order, ...>
 */
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
    /**
     * Returns the Prisma delegate for the Order model.
     *
     * @returns {Prisma.OrderDelegate<DefaultArgs>} The Prisma delegate for Order.
     */
    protected getModel() {
        return prisma.order;
    }

    /**
     * Retrieves all orders matching the provided filter criteria.
     *
     * @param {Prisma.OrderFindManyArgs<DefaultArgs>} [args] - Optional filter, pagination, and sorting options.
     * @returns {Promise<Order[]>} A promise that resolves to an array of Order entities.
     * @throws {ValidationError} If an error occurs during retrieval.
     */
    public async findAll(args?: Prisma.OrderFindManyArgs<DefaultArgs>): Promise<Order[]> {
        try {
            return await this.getModel().findMany(args);
        } catch (error) {
            this.handleError(error, "findAll", args);
        }
    }

    /**
     * Creates a new order after validating the input and assigning the ticket price.
     *
     * @param {Prisma.OrderCreateArgs<DefaultArgs>} args - The arguments for creating an order, including data.
     * @returns {Promise<Order>} A promise that resolves to the created Order entity.
     * @throws {ValidationError} If the order amount is invalid, status is not pending, or ticket ID is invalid.
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