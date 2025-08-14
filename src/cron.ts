import nodeCron from "node-cron";

import { OrderService } from "./service";

console.log(`Cron job started`);

nodeCron.schedule("* * * * *", async () => {
    const orderService = new OrderService();
    await orderService.cancelExpiredOrders();
});
