/* eslint-disable no-console */
import { format } from 'date-fns';
import Table from 'easy-table';
import inquirer from 'inquirer';
import DatePrompt from 'inquirer-datepicker-prompt';
import Task from './Task.js';
import todoList from './TodoList.js';

inquirer.registerPrompt('date', DatePrompt);

export default class CLI {
  private static todoList = todoList;

  private static ui = new inquirer.ui.BottomBar();

  public constructor() {
    throw new Error(
      'This is a static class. Do not instantiate a static Class.'
    );
  }

  public static run() {
    CLI.displayTasks();
  }

  static clear() {
    process.stdout.write('\u001B[2J\u001B[0;0f');
    console.log('');
  }

  static displayTasks() {
    CLI.clear();

    const tasks = CLI.todoList.current.list();
    const taskTable = Table.print(tasks, (task: Task, cell) => {
      cell('Done', task.checklist);
      cell('Priority', task.priority);
      cell('Title', task.title);
      cell('Due', task.printDueDate());
      cell('Note', task.notes);
    });

    console.log(CLI.todoList.current.title);
    console.log(taskTable);
    CLI.selectTaskAction();
  }

  private static selectTaskAction() {
    const choices =
      CLI.todoList.current.title === "Today's Tasks"
        ? ['Select a Project']
        : ['Select a Project', 'Add Task', 'Remove Task', 'Edit Task'];

    inquirer
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

  static selectProject() {
    CLI.clear();

    inquirer
      .prompt([
        {
          type: 'rawlist',
          name: 'project',
          message: 'Which project would you like to select?',
          choices: CLI.todoList.listProjectTitles(),
        },
      ])
      .then((answer) => {
        const title = answer.project;
        if (title === "Today's Tasks") {
          CLI.todoList.current = CLI.todoList.getTodaysTasks();
        } else {
          const proj = CLI.todoList.getProject(title);
          if (typeof proj === 'undefined') {
            throw new Error(`Could not find project "${title}`);
          } else {
            CLI.todoList.current = proj;
          }
          CLI.displayTasks();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static addTask() {
    const today = new Date();

    inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Enter a title for your task: ',
        },
        {
          type: 'input',
          name: 'description',
          message: 'Enter a description for your task: ',
        },
        {
          type: 'date',
          name: 'dueDate',
          message: 'Enter date when your task is due: ',
          initial: today,
          format: ['mm', '/', 'dd', '/', 'yyyy'],
          date: {
            min: format(today, 'MM/dd/yyyy'),
          },
        },
      ])
      .then((answer) => {
        const task = new Task({
          title: answer.title,
          description: answer.description,
          dueDate: answer.dueDate,
        });
        CLI.todoList.current.add(task);
        CLI.ui.updateBottomBar(`Added task: ${task.title}`);
        CLI.displayTasks();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static removeTask() {
    inquirer
      .prompt([
        {
          type: 'rawlist',
          name: 'title',
          message: 'Which task would you like to remove? ',
          choices: CLI.todoList.current.listTaskTitles(),
        },
      ])
      .then((answer) => {
        const task = CLI.todoList.current.getTask(answer.title);
        if (task !== undefined) {
          CLI.todoList.current.remove(task);
          CLI.ui.updateBottomBar(`Removed task: ${task.title}`);
        } else {
          CLI.ui.updateBottomBar(`ERROR: ${answer.title} was not found`);
        }
        CLI.displayTasks();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static editTask() {
    inquirer
      .prompt([
        {
          type: 'rawlist',
          name: 'title',
          message: 'Which task would you like to edit?',
          choices: CLI.todoList.current.listTaskTitles(),
        },
      ])
      .then((answer) => {
        const task = CLI.todoList.current.getTask(answer.title);
        if (task !== undefined) {
          inquirer
            .prompt([
              {
                type: 'input',
                name: 'title',
                message: 'Enter the title for your task: ',
                default: task.title,
              },
              {
                type: 'input',
                name: 'description',
                message: 'Enter a description for your task: ',
                default: task.description,
              },
              {
                type: 'date',
                name: 'dueDate',
                message: 'Enter date when your task is due: ',
                initial: task.dueDate,
                format: ['mm', '/', 'dd', '/', 'yyyy'],
                date: {
                  min: format(new Date(), 'MM/dd/yyyy'),
                },
              },
            ])
            .then((details) => {
              const newTask = new Task({
                title: details.title,
                description: details.description,
                dueDate: details.dueDate,
              });
              CLI.todoList.current.add(newTask);
              CLI.todoList.current.remove(task);
              CLI.ui.updateBottomBar(`Edited task: ${task.title}`);
              CLI.displayTasks();
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          CLI.ui.updateBottomBar(`ERROR: ${answer.title} was not found`);
        }
        CLI.displayTasks();
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
