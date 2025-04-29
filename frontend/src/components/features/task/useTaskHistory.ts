import { useCallback, useState } from 'react';

import { taskApi } from '@/services/api/taskApi';
import useTaskStore from '@/store/taskStore';
import { useHistoryStore } from '@/store/historyStore';
import { FilterFormData } from '@/types/task';

export const useTaskHistory = () => {
  const [historyError, setHistoryError] = useState<string | null>(null);
  const { setTasks, setLoading, filters } = useTaskStore();
  const { undo, redo } = useHistoryStore();

  const handleUndo = useCallback(async () => {
    try {
      setLoading(true);
      await undo();
      // 重新获取最新数据
      const data = await taskApi.getTasks(filters as FilterFormData);
      setTasks(data);
    } catch (err) {
      setHistoryError(err instanceof Error ? err.message : '撤销操作失败');
    } finally {
      setLoading(false);
    }
  }, [undo, setLoading, setTasks, filters]);

  const handleRedo = useCallback(async () => {
    try {
      setLoading(true);
      await redo();
      // 重新获取最新数据
      const data = await taskApi.getTasks(filters as FilterFormData);
      setTasks(data);
    } catch (err) {
      setHistoryError(err instanceof Error ? err.message : '重做操作失败');
    } finally {
      setLoading(false);
    }
  }, [redo, setLoading, setTasks, filters]);

  return {
    historyError,
    setHistoryError,
    handleUndo,
    handleRedo
  };
};
