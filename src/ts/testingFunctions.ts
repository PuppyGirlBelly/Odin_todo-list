import {
  endOfISOWeek,
  endOfToday,
  endOfTomorrow,
  endOfYesterday,
} from 'date-fns';
import Project from './Project.js';
import Task from './Task.js';

function testProject(name: string) {
  const proj = new Project({
    title: name,
  });

  const task1 = new Task({
    title: 'Task 1',
    description: `${name} Today's task`,
    dueDate: endOfToday(),
  });
  const task2 = new Task({
    title: 'Task 2',
    description: `${name} - Tomorrow's task`,
    dueDate: endOfTomorrow(),
  });
  const task3 = new Task({
    title: 'Task 3',
    description: `${name} - Yesterday's task`,
    dueDate: endOfYesterday(),
  });
  const task4 = new Task({
    title: 'Task 4',
    description: `${name} - End of Week task`,
    dueDate: endOfISOWeek(new Date()),
  });

  proj.add(task1);
  proj.add(task2);
  proj.add(task3);
  proj.add(task4);

  return proj;
}

export default testProject;
