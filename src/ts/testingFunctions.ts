import {
  endOfISOWeek,
  endOfToday,
  endOfTomorrow,
  endOfYesterday,
} from 'date-fns';
import Project from './Project';
import Task from './Task';

function testProject(title: string) {
  const proj = new Project({
    title,
  });

  const task1 = new Task({
    title: 'Task 1',
    description: `${title} Today's task`,
    dueDate: endOfToday(),
  });
  const task2 = new Task({
    title: 'Task 2',
    description: `${title} - Tomorrow's task`,
    dueDate: endOfTomorrow(),
  });
  const task3 = new Task({
    title: 'Task 3',
    description: `${title} - Yesterday's task`,
    dueDate: endOfYesterday(),
  });
  const task4 = new Task({
    title: 'Task 4',
    description: `${title} - End of Week task`,
    dueDate: endOfISOWeek(new Date()),
  });

  proj.add(task1);
  proj.add(task2);
  proj.add(task3);
  proj.add(task4);

  return proj;
}

export default testProject;
