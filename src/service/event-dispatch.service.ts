import { Subject, TicketCreatedUpdatedEvent } from "@jiaul.islam/common.ticketing.dev";
import { TicketService } from "./ticket.service";


const ticketService = new TicketService();


/**
 * Handler for the TICKET_CREATED event.
 * Creates a new ticket in the database using the provided data.
 * @param data - The ticket data containing id, title, and price.
 */
const handleTicketCreate = async (data: TicketCreatedUpdatedEvent) => {
    const { id, title, price, version } = data;
    await ticketService.create({
        data: {
            id,
            title,
            price,
            version
        }
    });
}



/**
 * Handler for the TICKET_UPDATED event.
 * Updates an existing ticket in the database with the provided data.
 * @param data - The ticket data containing id, title, and price.
 */
const handleTicketUpdate = async (data: TicketCreatedUpdatedEvent) => {
    const { id, title, price, version } = data;
    await ticketService.update({
        where: { id: id, version: version - 1 }, // using optimistic version control
        data: {
            title,
            price,
            version
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


export { topicHandlers }