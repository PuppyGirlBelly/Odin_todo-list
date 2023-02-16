import Table from 'easy-table';
import todoList from './TodoList';

function cli() {
  const TODO = todoList;
  let t = new Table();

  TODO.list().forEach((proj) => {
    t.cell('Title', proj.title);
    t.newRow();
  });

  console.log(t.toString());
  t = new Table();

  TODO.getCurrent()
    .list()
    .forEach((task) => {
      t.cell('Done', task.checklist);
      t.cell('Priority', task.priority);
      t.cell('Title', task.title);
      t.cell('Due', task.dueDate);
      t.newRow();
    });

  console.log(t.toString());
}

export default cli;
