import React, { useState } from 'react';

import TaskList from '@/components/features/task/TaskList';
import { Task } from '@/types/task';

const TaskListPage = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: '完成项目文档',
      description: '编写项目的主要功能和架构文档',
      status: 'todo',
      priority: 'high',
      dueDate: new Date('2024-04-20'),
      tags: ['文档', '重要'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: '修复登录问题',
      description: '解决用户登录时的验证码问题',
      status: 'inProgress',
      priority: 'medium',
      dueDate: new Date('2024-04-18'),
      tags: ['bug', '前端'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      title: '优化性能',
      description: '对主要页面进行性能优化',
      status: 'completed',
      priority: 'low',
      tags: ['优化'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  const handleEditTask = (task: Task) => {
    // 处理编辑任务
  };

  const handleDeleteTask = (taskId: string) => {
    // 处理删除任务
  };

  const handleToggleStatus = (taskId: string) => {
    // 处理切换任务状态
  };

  const handleFilterChange = (filters: FilterFormData) => {
    // 处理过滤条件变化
  };

  return (
    <TaskList
      tasks={tasks}
      onEditTask={handleEditTask}
      onDeleteTask={handleDeleteTask}
      onToggleStatus={handleToggleStatus}
      onFilterChange={handleFilterChange}
    />
  );
};

export default TaskListPage;
