import express, { Request, Response, NextFunction } from 'express';


const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = { "message": "orders list route working" };
        res.json(orders);
    } catch (error) {
        next(error);
    }
});


export { router as orderRouter };