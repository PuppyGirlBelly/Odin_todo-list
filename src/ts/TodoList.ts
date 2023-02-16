import { Holder } from './Holder';
import Project from './Project';
import testProject from './testingFunctions';

class TodoList extends Holder<Project> {
  _collection: Project[];

  _current: Project;

  postInitialization(): void {
    this._collection = [];
  }

  list(): string[] {
    const list: string[] = [];

    this._collection.forEach((p: Project) => {
      list.push(p.title);
    });

    return list;
  }

  getProject(title: string): Project | undefined {
    return this._collection.find((p) => p.title === title);
  }

  getCurrent(): Project {
    if (this._collection.length === 0) return this.getTodaysTasks();
    if (!this._current) [this._current] = this._collection;
    return this._current;
  }

  getTodaysTasks(): Project {
    const todays = new Project({
      title: "Today's Tasks",
    });

    this._collection.forEach((proj) => {
      proj.getTodaysTasks().forEach((subtask) => {
        todays.add(subtask);
      });
    });

    return todays;
  }
}

const todoList = new TodoList({
  title: 'Project Collection',
});

todoList.add(testProject('Test Project 1'));
todoList.add(testProject('Test Project 2'));
todoList.getCurrent();

export default todoList;
