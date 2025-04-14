import React, { useState } from 'react';
import { Box, Container, Typography, Button, Dialog } from '@mui/material';

import { TaskCard } from '@/components/ui';
import { Task, TaskStatus, TaskFormData } from '@/types/task';
import TaskForm from '@/components/ui/task/TaskForm';

const TestTaskPage: React.FC = () => {
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

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateTask = (data: TaskFormData) => {
    const newTask: Task = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setTasks([...tasks, newTask]);
    setIsCreateDialogOpen(false);
  };

  const handleEdit = (id: string) => {
    console.log('编辑任务:', id);
    // TODO: 实现编辑逻辑
  };

  const handleDelete = (id: string) => {
    console.log('删除任务:', id);
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleStatusChange = (id: string, status: TaskStatus) => {
    console.log('更新任务状态:', id, status);
    setTasks(
      tasks.map(task => (task.id === id ? { ...task, status, updatedAt: new Date() } : task))
    );
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            任务管理测试页面
          </Typography>
          <Button variant="contained" onClick={() => setIsCreateDialogOpen(true)}>
            创建任务
          </Button>
        </Box>

        <Box sx={{ mt: 4 }}>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </Box>

        <Dialog
          open={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <Box sx={{ p: 3 }}>
            <TaskForm onSubmit={handleCreateTask} onCancel={() => setIsCreateDialogOpen(false)} />
          </Box>
        </Dialog>
      </Box>
    </Container>
  );
};

export default TestTaskPage;
