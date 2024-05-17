import { UuidAdapter } from '../../config';
import { ticketsSeed } from '../../data/data';
import { Ticket } from '../../domain/interfaces';
import { WssService } from './wss.service';

export class TicketService {
  constructor(private readonly wssService = WssService.instance) {}

  public tickets: Ticket[] = ticketsSeed;
  private readonly ticketsWorkingOn: Ticket[] = [];

  public get pendingTickets(): Ticket[] {
    return this.tickets.filter(ticket => !ticket.handledAtDesk);
  }

  public get lastTicketsWorkingOn(): Ticket[] {
    return this.ticketsWorkingOn.slice(0, 4);
  }

  public get lastTicketNumber(): number {
    return this.tickets.length > 0 ? this.tickets.at(-1)!.number : 0;
  }

  public createTicket() {
    const ticket = {
      id: UuidAdapter.v4(),
      number: this.lastTicketNumber + 1,
      createdAt: new Date(),
      done: false,
    };

    this.tickets.push(ticket);
    this.onTicketNumberChange()

    return ticket;
  }

  public drawTicket(desk: string) {
    const ticket = this.tickets.find(ticket => !ticket.handledAtDesk);

    if (!ticket) {
      return {
        status: 'error',
        message: 'No tickets available',
      };
    }

    ticket.handledAtDesk = desk;
    ticket.handledAt = new Date();

    this.ticketsWorkingOn.unshift({ ...ticket });
    this.onTicketNumberChange()
    this.onWorkingOnChange()

    return {
      status: 'ok',
      ticket
    };
  }

  public onFinishedTicket(id: string) {
    const ticket = this.tickets.find(ticket => ticket.id === id);

    if (!ticket) {
      return {
        status: 'error',
        message: 'Ticket not found',
      };
    }

    this.tickets = this.tickets.map(ticket => {
      if (ticket.id === id) {
        ticket.done = true;
      }

      return ticket;
    });

    return {
      status: 'ok',
    };
  }

  private onTicketNumberChange() {
    this.wssService.sendMessage('on-ticket-count-changed', this.pendingTickets.length);
  }

  private onWorkingOnChange() {
    this.wssService.sendMessage('on-working-changed', this.lastTicketsWorkingOn);
  }
}
