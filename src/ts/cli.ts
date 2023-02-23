/* eslint-disable no-console */
import { format } from 'date-fns';
import Table from 'easy-table';
import inquirer from 'inquirer';
import DatePrompt from 'inquirer-datepicker-prompt';
import Task from './Task.js';
import todoList from './TodoList.js';

inquirer.registerPrompt('date', DatePrompt);

const TODO_LIST = todoList;

let currentProject = TODO_LIST.getTodaysTasks();

export default class CLI {
  public constructor() {
    throw new Error(
      'This is a static class. Do not instantiate a static Class.'
    );
  }

  public static run() {
    CLI.displayTasks();
  }

  private static clear() {
    process.stdout.write('\u001B[2J\u001B[0;0f');
    console.log('');
  }

  private static getTaskActionChoices(): string[] {
    const choices = ['Select a Project'];

    if (currentProject.title !== "Today's Tasks") {
      choices.push('Add Task');

      if (currentProject.length() >= 1) {
        choices.push('Remove Task', 'Edit Task');
      }
    }

    return choices;
  }

  static async newTaskPrompt(defaults?: Task): Promise<Task> {
    const today = new Date();
    const d =
      defaults ||
      new Task({
        title: 'New Task',
        description: 'description',
        dueDate: today,
      });

    CLI.clear();

    return inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Enter a title for your task: ',
          default: d.title,
        },
        {
          type: 'input',
          name: 'description',
          message: 'Enter a description for your task: ',
          default: d.description,
        },
        {
          type: 'date',
          name: 'dueDate',
          message: 'Enter date when your task is due: ',
          default: d.dueDate,
          format: ['mm', '/', 'dd', '/', 'yyyy'],
          date: {
            min: format(today, 'MM/dd/yyyy'),
          },
        },
      ])
      .then(
        (answer) =>
          new Task({
            title: answer.title,
            description: answer.description,
            dueDate: answer.dueDate,
          })
      )
      .catch((error) => {
        throw new Error(error);
      });
  }

  private static displayTasks() {
    CLI.clear();

    const tasks = currentProject.list();
    const taskTable = Table.print(tasks, (task: Task, cell) => {
      cell('Done', task.checklist);
      cell('Priority', task.priority);
      cell('Title', task.title);
      cell('Due', task.printDueDate());
      cell('Note', task.notes);
    });
    console.log(currentProject.title);
    console.log(taskTable);
    CLI.selectTaskAction();
  }

  private static async selectTaskAction() {
    const choices = CLI.getTaskActionChoices();

    await inquirer
      .prompt([
        {
          type: 'list',
          name: 'taskAction',
          message: 'Menu: ',
          choices,
        },
      ])
      .then((answer) => {
        switch (answer.taskAction) {
          case 'Select a Project':
            CLI.selectProject();
            break;
          case 'Add Task':
            CLI.addTask();
            break;
          case 'Remove Task':
            CLI.removeTask();
            break;
          case 'Edit Task':
            CLI.editTask();
            break;
          default:
            throw new Error(`Invalid taskAction option: ${answer.taskAction}`);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  private static async selectProject() {
    CLI.clear();

    await inquirer
      .prompt([
        {
          type: 'rawlist',
          name: 'project',
          message: 'Which project would you like to select?',
          choices: TODO_LIST.listProjectTitles(),
        },
      ])
      .then((answer) => {
        const title = answer.project;
        if (title === "Today's Tasks") {
          currentProject = TODO_LIST.getTodaysTasks();
        } else {
          const proj = TODO_LIST.getProject(title);
          if (typeof proj === 'undefined') {
            throw new Error(`Could not find project "${title}`);
          } else {
            currentProject = proj;
          }
          CLI.displayTasks();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  private static async selectTask(): Promise<Task> {
    CLI.clear();

    return inquirer
      .prompt([
        {
          type: 'rawlist',
          name: 'task',
          message: 'Which task would you like to select?',
          choices: currentProject.listTaskTitles(),
        },
      ])
      .then((answer) => {
        const title = answer.task;
        const task = currentProject.getTask(title);
        if (typeof task === 'undefined') {
          throw new Error(`Could not find task "${title}`);
        } else {
          return task;
        }
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  static addTask() {
    CLI.newTaskPrompt().then((newTask) => {
      currentProject.add(newTask);
      CLI.displayTasks();
    });
  }

  static removeTask() {
    CLI.selectTask().then((task) => {
      currentProject.remove(task);
      CLI.displayTasks();
    });
  }

  static editTask() {
    CLI.selectTask().then((task) => {
      currentProject.remove(task);
      CLI.newTaskPrompt(task).then((newTask) => {
        currentProject.add(newTask);
        CLI.displayTasks();
      });
    });
  }
}
