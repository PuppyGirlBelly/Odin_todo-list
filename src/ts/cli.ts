/* eslint-disable no-console */
import Table from 'easy-table';
import inquirer from 'inquirer';
import type Task from './Task';
import todoList from './TodoList.js';

const TODO = todoList;

function listProjectNames(): string[] {
  const list: string[] = [];

  TODO.list().forEach((proj) => {
    list.push(proj.title);
  });

  list.push("Today's Tasks");

  return list;
}

function displayTasks() {
  const tasks = TODO.current.list();
  const taskTable = Table.print(tasks, (task: Task, cell) => {
    cell('Done', task.checklist);
    cell('Priority', task.priority);
    cell('Title', task.title);
    cell('Due', task.printDueDate());
    cell('Note', task.notes);
  });

  console.log(TODO.current.title);
  console.log(taskTable);
}

function selectProject() {
  inquirer
    .prompt([
      {
        type: 'rawlist',
        name: 'project',
        message: 'Which project would you like to select?',
        choices: listProjectNames(),
      },
    ])
    .then((answer) => {
      const title = answer.project;
      if (title === "Today's Tasks") {
        TODO.current = TODO.getTodaysTasks();
      } else {
        const proj = TODO.getProject(title);
        if (typeof proj === 'undefined') {
          throw new Error(`Could not find project "${title}`);
        } else {
          TODO.current = proj;
        }
      }
      displayTasks();
    })
    .catch((error) => {
      console.log(error);
    });
}

function cli() {
  selectProject();
}

export default cli;
