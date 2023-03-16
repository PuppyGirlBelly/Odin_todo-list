import { compareAsc, isToday } from 'date-fns';
import Holder from './Holder.js';
import type Task from './Task.js';

export interface ProjectArgs {
  title: string;
}

export default class Project extends Holder<Task> {
  title!: string;

  postInitialization(args: ProjectArgs) {
    this.title = args.title;
  }

  private _sort() {
    this._collection.sort(
      (a: Task, b: Task) =>
        +a.finished - +b.finished ||
        b.priority - a.priority ||
        compareAsc(a.dueDate, b.dueDate)
    );
  }

  protected _import(list: Task[]) {
    this._collection = list;
  }

  list(): Task[] {
    this._sort();
    return this._collection;
  }

  listTaskTitles(): string[] {
    const list: string[] = [];

    this._collection.forEach((task: Task) => {
      list.push(task.title);
    });

    return list;
  }

  getTask(title: string): Task | undefined {
    return this._collection.find((t) => t.title === title);
  }

  getTodaysTasks(): Task[] {
    return this._collection.filter((t) => isToday(t.dueDate));
  }
}
