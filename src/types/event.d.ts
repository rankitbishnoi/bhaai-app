import {CreatedbyInterface} from './createdBy';

export interface EventInterface {
  _id: string;
  name: string;
  createdAt: string;
  createdBy: CreatedbyInterface;
  tasks: TaskInterface[];
}

export interface TaskInterface {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  totalExpectedOpex: number;
  spendings: spendingOpex[];
  createdAt: string;
  contact: TaskContact;
}

export enum TaskStatus {
  PENDING = 'pending',
  PROGRESS = 'progress',
  DONE = 'done',
}

export interface spendingOpex {
  amount: number;
  createdAt: string;
}

export interface TaskContact {
  name: string;
  details: string;
  mobileNumber: string;
}
