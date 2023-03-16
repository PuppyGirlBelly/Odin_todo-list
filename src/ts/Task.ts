/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import { endOfDay, format } from 'date-fns';

enum Priority {
  LOW = 0,
  MEDIUM,
  HIGH,
  URGENT,
}

export interface TaskArgs {
  done?: boolean;
  priority?: Priority;
  title?: string;
  dueDate?: Date;
  description?: string;
}

export default class Task {
  title: string;

  description: string;

  finished: boolean;

  private _priority: Priority;

  private _dueDate: Date;

  public constructor(args: TaskArgs) {
    this.finished = args.done || false;
    this._priority = args.priority || Priority.LOW;
    this.title = args.title || 'New task';
    this._dueDate = endOfDay(args.dueDate || new Date());
    this.description = args.description || 'This is a new task';
  }

  public get dueDate(): Date {
    return this._dueDate;
  }

  public set dueDate(value: Date) {
    this._dueDate = value;
    this._dueDate = endOfDay(this._dueDate);
  }

  public printDueDate(): string {
    return format(this._dueDate, 'LLL d Y');
  }

  public get priority(): number {
    return this._priority;
  }

  public incrementPriority() {
    this._priority += 1;
    if (this._priority > Priority.URGENT) this._priority = Priority.LOW;
  }
}
