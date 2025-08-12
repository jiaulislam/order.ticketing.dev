import { PrismaClient } from "@prisma/client"
import { Subject } from "@jiaul.islam/common.ticketing.dev";


const prisma = new PrismaClient();


/**
 * Handler for the TICKET_CREATED event.
 * Creates a new ticket in the database using the provided data.
 * @param data - The ticket data containing id, title, and price.
 */
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



/**
 * Handler for the TICKET_UPDATED event.
 * Updates an existing ticket in the database with the provided data.
 * @param data - The ticket data containing id, title, and price.
 */
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