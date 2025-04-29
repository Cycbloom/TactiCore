import { Task, TaskPriority } from '@/types/task';

// 计算任务剩余时间（小时）
const calculateRemainingHours = (task: Task): number => {
  if (!task.dueDate) return Infinity;
  const now = new Date();
  const dueDate = new Date(task.dueDate);
  return Math.max(0, (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60));
};

// 计算任务进度
const calculateProgress = (task: Task): number => {
  if (!task.estimatedHours || !task.actualHours) return 0;
  return (task.actualHours / task.estimatedHours) * 100;
};

// 计算任务优先级分数
export const calculatePriorityScore = (task: Task): number => {
  let score = 0;

  // 基础分数：基于当前优先级
  const baseScores = {
    [TaskPriority.URGENT]: 100,
    [TaskPriority.HIGH]: 80,
    [TaskPriority.MEDIUM]: 60,
    [TaskPriority.LOW]: 40,
    [TaskPriority.MINIMAL]: 20
  };
  score += baseScores[task.priority];

  // 时间紧迫性：剩余时间越少，分数越高
  const remainingHours = calculateRemainingHours(task);
  if (remainingHours !== Infinity) {
    const timeScore = Math.max(0, 100 - (remainingHours / 24) * 20); // 每24小时减少20分
    score += timeScore;
  }

  // 进度影响：进度越慢，分数越高
  const progress = calculateProgress(task);
  const progressScore = (100 - progress) * 0.5; // 每1%进度减少0.5分
  score += progressScore;

  // 依赖关系影响：被阻塞的任务优先级降低
  if (task.isBlocked) {
    score -= 20;
  }

  // 确保分数在0-100之间
  return Math.max(0, Math.min(100, score));
};

// 根据分数确定优先级
export const determinePriority = (score: number): TaskPriority => {
  if (score >= 90) return TaskPriority.URGENT;
  if (score >= 70) return TaskPriority.HIGH;
  if (score >= 50) return TaskPriority.MEDIUM;
  if (score >= 30) return TaskPriority.LOW;
  return TaskPriority.MINIMAL;
};

// 更新任务优先级
export const updateTaskPriority = (task: Task): Task => {
  const newScore = calculatePriorityScore(task);
  const newPriority = determinePriority(newScore);

  return {
    ...task,
    priorityScore: newScore,
    priority: newPriority,
    isUrgent: newPriority === TaskPriority.URGENT
  };
};
