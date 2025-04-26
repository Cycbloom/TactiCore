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
  deleteTask: (path: string[]) => void;
}

const ROOT_TASK_ID = '00000000-0000-0000-0000-000000000000';

// 递归处理任务树
const processTaskTree = (
  tasks: Task[],
  path: string[],
  processFn: (tasks: Task[]) => Task[]
): Task[] => {
  // 如果是根任务，直接处理 [ROOT_TASK_ID, ..., task.id] 长度至少为2
  if (path.length === 2) {
    return processFn(tasks);
  }

  return tasks.map(task => {
    // 如果当前任务在path中
    if (path.includes(task.id)) {
      // 如果是目标任务的父任务
      if (task.id === path[path.length - 2]) {
        return {
          ...task,
          children: processFn(task.children || [])
        };
      }
      // 如果还有子任务，继续递归
      if (task.children?.length) {
        return {
          ...task,
          children: processTaskTree(task.children, path, processFn)
        };
      }
    }
    return task;
  });
};

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
      tasks: processTaskTree(state.tasks, task.path, tasks => [...tasks, task])
    })),
  updateTask: task =>
    set(state => ({
      tasks: processTaskTree(state.tasks, task.path, tasks =>
        tasks.map(t => (t.id === task.id ? task : t))
      )
    })),
  deleteTask: path =>
    set(state => ({
      tasks: processTaskTree(state.tasks, path, tasks =>
        tasks.filter(t => t.id !== path[path.length - 1])
      )
    }))
}));

export default useTaskStore;
