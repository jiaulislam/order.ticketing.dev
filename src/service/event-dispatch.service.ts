import { PrismaClient } from "@prisma/client"
import { Subject } from "@jiaul.islam/common.ticketing.dev";


const prisma = new PrismaClient();

const handleTicketCreate = async (data: { id: number, title: string, price: number }) => {
    const { id, title, price } = data;

    await prisma.ticket.create({
        data: {
            id,
            title,
            price
        }
    });
}


const handleTicketUpdate = async (data: { id: number, title: string, price: number }) => {
    const { id, title, price } = data;

    await prisma.ticket.update({
        where: { id },
        data: {
            title,
            price
        }
    });
}

type HandlerFn = (data: any) => Promise<void>;
// Map each Subject to its handler function
type TopicHandlers = {
    [key in Subject]: HandlerFn;
};
const topicHandlers: TopicHandlers = {} as TopicHandlers;

topicHandlers[Subject.TICKET_CREATED] = handleTicketCreate
topicHandlers[Subject.TICKET_UPDATED] = handleTicketUpdate


export default topicHandlers