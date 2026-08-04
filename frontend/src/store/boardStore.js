import { create } from 'zustand';

const useBoardStore = create((set, get) => ({
  columns: {},
  tasksByColumn: {},

  // Initialize board from API data
  initBoard: (tasks) => {
    const cols = {
      todo: { id: 'todo', title: 'To Do', color: '#505f76', tasks: [] },
      in_progress: { id: 'in_progress', title: 'In Progress', color: '#004ac6', tasks: [] },
      done: { id: 'done', title: 'Done', color: '#10B981', tasks: [] },
    };
    tasks.forEach((task) => {
      const col = task.status in cols ? task.status : 'todo';
      cols[col].tasks.push(task);
    });
    set({ columns: cols });
  },

  // Optimistic move
  moveTask: (taskId, fromCol, toCol, fromIndex, toIndex) => {
    const columns = { ...get().columns };
    const from = { ...columns[fromCol], tasks: [...columns[fromCol].tasks] };
    const to = { ...columns[toCol], tasks: [...columns[toCol].tasks] };

    const [moved] = from.tasks.splice(fromIndex, 1);
    moved.status = toCol;
    to.tasks.splice(toIndex, 0, moved);

    columns[fromCol] = from;
    columns[toCol] = to;
    set({ columns });
  },

  addTask: (task) => {
    const columns = { ...get().columns };
    const col = task.status in columns ? task.status : 'todo';
    columns[col] = { ...columns[col], tasks: [...columns[col].tasks, task] };
    set({ columns });
  },

  updateTask: (updatedTask) => {
    const columns = { ...get().columns };
    Object.keys(columns).forEach((colId) => {
      columns[colId] = {
        ...columns[colId],
        tasks: columns[colId].tasks.map((t) =>
          t.id === updatedTask.id ? updatedTask : t
        ),
      };
    });
    set({ columns });
  },

  deleteTask: (taskId) => {
    const columns = { ...get().columns };
    Object.keys(columns).forEach((colId) => {
      columns[colId] = {
        ...columns[colId],
        tasks: columns[colId].tasks.filter((t) => t.id !== taskId),
      };
    });
    set({ columns });
  },
}));

export default useBoardStore;
