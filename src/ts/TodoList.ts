import { Holder } from './Holder.js';
import Project from './Project.js';
import testProject from './testingFunctions.js';

class TodoList extends Holder<Project> {
  private _current!: Project;

  postInitialization(): void {
    this._collection.push(testProject('Test Project 1'));
    this._current = this._collection[0] || this.getTodaysTasks();
  }

  list(): Project[] {
    return this._collection;
  }

  getProject(title: string): Project | undefined {
    return this._collection.find((p) => p.title === title);
  }

  set current(proj: Project) {
    this._current = proj;
  }

  get current(): Project {
    if (!this._current) {
      this._current = this._collection[0] || this.getTodaysTasks();
    }
    return this._current;
  }

  getTodaysTasks(): Project {
    const todays = new Project({
      title: "Today's Tasks",
    });

    this._collection.forEach((proj) => {
      proj.getTodaysTasks().forEach((subtask) => {
        const t = subtask;
        t.notes = proj.title;
        todays.add(t);
      });
    });

    return todays;
  }
}

const todoList = new TodoList({
  title: 'Project Collection',
});

todoList.add(testProject('Test Project 2'));

export default todoList;
