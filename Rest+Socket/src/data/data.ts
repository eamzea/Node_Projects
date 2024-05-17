import { UuidAdapter } from "../config";

export const ticketsSeed = [
  {
    id: UuidAdapter.v4(),
    number: 1,
    createdAt: new Date(),
    done: false,
  },
  {
    id: UuidAdapter.v4(),
    number: 2,
    createdAt: new Date(),
    done: false,
  },
  {
    id: UuidAdapter.v4(),
    number: 3,
    createdAt: new Date(),
    done: false,
  },
  {
    id: UuidAdapter.v4(),
    number: 4,
    createdAt: new Date(),
    done: false,
  },
  {
    id: UuidAdapter.v4(),
    number: 5,
    createdAt: new Date(),
    done: false,
  },
];
