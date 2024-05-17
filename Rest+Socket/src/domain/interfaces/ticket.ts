export interface Ticket {
  id: string;
  number: number;
  createdAt: Date;
  handledAtDesk?: string;
  handledAt?: Date;
  done: boolean;
  doneAt?: boolean
}
