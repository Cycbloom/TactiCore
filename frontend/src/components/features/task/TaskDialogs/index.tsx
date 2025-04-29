import React from 'react';
import { Dialog, Box } from '@mui/material';

import TaskForm from './TaskForm';

import { Task, TaskFormData } from '@/types/task';

interface TaskDialogsProps {
  isCreateDialogOpen: boolean;
  editingTask: Task | null;
  parentTaskId?: string;
  onCloseCreateDialog: () => void;
  onCloseEditDialog: () => void;
  onSubmitCreate: (formData: TaskFormData) => void;
  onSubmitEdit: (formData: TaskFormData) => void;
}

const TaskDialogs: React.FC<TaskDialogsProps> = ({
  isCreateDialogOpen,
  editingTask,
  parentTaskId,
  onCloseCreateDialog,
  onCloseEditDialog,
  onSubmitCreate,
  onSubmitEdit
}) => {
  return (
    <>
      <Dialog open={isCreateDialogOpen} onClose={onCloseCreateDialog} maxWidth="sm" fullWidth>
        <Box sx={{ p: 3 }}>
          <TaskForm
            onSubmit={onSubmitCreate}
            onCancel={onCloseCreateDialog}
            initialData={parentTaskId ? { parentId: parentTaskId } : undefined}
            formTitle={parentTaskId ? '创建子任务' : '创建任务'}
            submitText={parentTaskId ? '创建子任务' : '创建任务'}
          />
        </Box>
      </Dialog>

      <Dialog open={!!editingTask} onClose={onCloseEditDialog} maxWidth="sm" fullWidth>
        <Box sx={{ p: 3 }}>
          <TaskForm
            initialData={editingTask || undefined}
            onSubmit={onSubmitEdit}
            onCancel={onCloseEditDialog}
            formTitle="编辑任务"
            submitText="保存"
          />
        </Box>
      </Dialog>
    </>
  );
};

export default TaskDialogs;
