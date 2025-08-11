import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { requireAuthMiddleware, validateRequestMiddleware, OrderStatusEnum } from '@jiaul.islam/common.ticketing.dev';
import { OrderService } from '../service';
import { StatusCodes } from 'http-status-codes';

const router = express.Router();

const orderService = new OrderService();

router.get("/health", (req: Request, res: Response) => {
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
    body('userId').notEmpty().withMessage('User ID is required'),
    body('status').isIn([OrderStatusEnum.PENDING, OrderStatusEnum.COMPLETED]).withMessage('Invalid order status'),
    body('totalAmount').isNumeric().withMessage('Total amount must be a number'),
], validateRequestMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await orderService.create(req.body);
        res.status(StatusCodes.CREATED).json(order);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

export { router as orderRouter };