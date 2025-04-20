import { create } from 'zustand';

import { Task } from '../types/task';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  selectedTask: Task | null;
  filters: {
    status: string;
    priority: string;
    search: string;
  };
}

interface TaskActions {
  setTasks: (tasks: Task[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedTask: (task: Task | null) => void;
  setFilters: (filters: Partial<TaskState['filters']>) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
}

const useTaskStore = create<TaskState & TaskActions>(set => ({
  // 状态
  tasks: [],
  loading: false,
  error: null,
  selectedTask: null,
  filters: {
    status: 'all',
    priority: 'all',
    search: ''
  },

  // 动作
  setTasks: tasks => set({ tasks }),
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),
  setSelectedTask: task => set({ selectedTask: task }),
  setFilters: filters =>
    set(state => ({
      filters: { ...state.filters, ...filters }
    })),
  addTask: task =>
    set(state => ({
      tasks: [...state.tasks, task]
    })),
  updateTask: task =>
    set(state => ({
      tasks: state.tasks.map(t => (t.id === task.id ? task : t))
    })),
  deleteTask: id =>
    set(state => ({
      tasks: state.tasks.filter(t => t.id !== id)
    }))
}));

export default useTaskStore;
