import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { requireAuthMiddleware, validateRequestMiddleware, OrderStatusEnum, ValidationError } from '@jiaul.islam/common.ticketing.dev';
import { OrderService, TicketService } from '../service';
import { StatusCodes } from 'http-status-codes';
import { OrderCreatedEventProducer, OrderUpdatedEventProducer } from '../events/order.event';

const router = express.Router();

const orderService = new OrderService();
const ticketService = new TicketService();

router.get("/health", (_, res: Response) => {
    res.json({ status: "OK" });
});

router.get('/', requireAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await orderService.findAll({ where: { userId: req.currentUser!.id }, include: { ticket: true } });
        res.json(orders);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/', requireAuthMiddleware, [
    body('status').isIn(
        [
            OrderStatusEnum.PENDING,
        ]
    ).withMessage('Invalid order status. Allowed Status: PENDING'),
    body("ticketId").notEmpty({ ignore_whitespace: true }).withMessage("ticketId is required"),
    body("ticketId").isInt({ gt: 0 }).withMessage("ticketId must be a positive integer"),
],
    validateRequestMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { status, ticketId } = req.body;
            // You may need to fetch the ticket to get its price for totalAmount
            const ticket = await ticketService.findUnique(ticketId);

            if (!ticket) {
                throw new ValidationError(`Ticket with ID ${ticketId} not found`);
            }

            const order = await orderService.create({
                data: {
                    userId: req.currentUser!.id,
                    status,
                    totalAmount: ticket.price,
                    ticket: {
                        connect: { id: ticketId }
                    }
                }
            });

            const orderProducer = new OrderCreatedEventProducer();
            await orderProducer.publish(order);

            res.status(StatusCodes.CREATED).json(order);
        } catch (error) {
            console.error(error);
            next(error);
        }
    });

router.put("/:id", requireAuthMiddleware, [
    body('status').isIn([
        OrderStatusEnum.PAYMENT_PENDING,
        OrderStatusEnum.CANCELLED,
        OrderStatusEnum.COMPLETED
    ]).withMessage('Invalid order status'),
], validateRequestMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { status, ticketId } = req.body;
        const order = await orderService.update({ where: { id: Number(req.params.id), userId: req.currentUser!.id }, data: { status, ticketId } });

        const orderProducer = new OrderUpdatedEventProducer();
        await orderProducer.publish(order);

        res.status(StatusCodes.OK).json(order);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

export { router as orderRouter };