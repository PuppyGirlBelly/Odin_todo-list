import Holder from './Holder.js';
import Project from './Project.js';
import testProject from './testingFunctions.js';

class TodoList extends Holder<Project> {
  current!: Project;

  postInitialization(): void {
    this._collection.push(testProject('Test Project 1'));
    this.current = this._collection[0] || this.getTodaysTasks();
  }

  list(): Project[] {
    return this._collection;
  }

  listProjectTitles(): string[] {
    const list: string[] = [];

    this._collection.forEach((proj) => {
      list.push(proj.title);
    });

    list.push("Today's Tasks");

    return list;
  }

  getProject(title: string): Project | undefined {
    return this._collection.find((p) => p.title === title);
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

const todoList = new TodoList();

todoList.add(testProject('Test Project 2'));

export default todoList;
