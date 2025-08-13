import { Prisma, Ticket, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { BaseModelService } from "@jiaul.islam/common.ticketing.dev";

const prisma = new PrismaClient();


export class TicketService extends BaseModelService<
    Prisma.TicketDelegate<DefaultArgs>,
    Ticket,
    Prisma.TicketFindUniqueArgs<DefaultArgs>,
    Prisma.TicketFindManyArgs<DefaultArgs>,
    Prisma.TicketCreateArgs<DefaultArgs>,
    Prisma.TicketUpdateArgs<DefaultArgs>,
    Prisma.TicketDeleteArgs<DefaultArgs>,
    Prisma.TicketCountArgs<DefaultArgs>,
    Prisma.TicketUpsertArgs<DefaultArgs>
> {
    protected getModel(): Prisma.TicketDelegate<DefaultArgs, {}> {
        return prisma.ticket;
    }
}