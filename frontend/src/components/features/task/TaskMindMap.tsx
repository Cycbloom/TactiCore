import React, { useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Position,
  Connection,
  addEdge,
  OnConnect,
  EdgeChange,
  NodeChange
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Box, Paper, Typography } from '@mui/material';

import TaskNode from './TaskNode';

import { Task, TaskStatus, ROOT_TASK_ID } from '@/types/task';

// 注册自定义节点
const nodeTypes = {
  taskNode: TaskNode
};

interface TaskMindMapProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskPath: string[]) => void;
  onToggleStatus: (taskId: string, newStatus: TaskStatus) => void;
  onAddSubtask: (parentId: string) => void;
  onMoveTask: (taskPath: string[], newTaskPath: string[]) => void;
}

const TaskMindMap: React.FC<TaskMindMapProps> = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onToggleStatus,
  onAddSubtask,
  onMoveTask
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // 递归处理任务及其子任务
  const processTask = useCallback(
    (task: Task, level: number = 0, index: number = 0) => {
      const nodes: Node[] = [];
      const edges: Edge[] = [];

      // 创建当前任务节点
      nodes.push({
        id: task.id,
        data: {
          label: task.title,
          task,
          onEdit: () => onEditTask(task),
          onDelete: () => onDeleteTask(task.path),
          onToggleStatus: (status: TaskStatus) => onToggleStatus(task.id, status),
          onAddSubtask: () => onAddSubtask(task.id),
          level
        },
        position: {
          x: level * 300,
          y: index * 150
        },
        type: 'taskNode',
        sourcePosition: Position.Right,
        targetPosition: Position.Left
      });

      // 如果有父任务，创建连接边
      if (task.path.length > 2) {
        const parentId = task.path[task.path.length - 2];
        edges.push({
          id: `${parentId}-${task.id}`,
          source: parentId,
          target: task.id,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#b1b1b7' }
        });
      }

      // 递归处理子任务
      if (task.children && task.children.length > 0) {
        task.children.forEach((childTask, childIndex) => {
          const { nodes: childNodes, edges: childEdges } = processTask(
            childTask,
            level + 1,
            childIndex
          );
          nodes.push(...childNodes);
          edges.push(...childEdges);
        });
      }

      return { nodes, edges };
    },
    [onEditTask, onDeleteTask, onToggleStatus, onAddSubtask]
  );

  // 将任务数据转换为节点和边
  const transformTasksToNodesAndEdges = useCallback(() => {
    const allNodes: Node[] = [];
    const allEdges: Edge[] = [];

    // 处理所有根任务
    tasks.forEach((task, index) => {
      const { nodes, edges } = processTask(task, 0, index);
      allNodes.push(...nodes);
      allEdges.push(...edges);
    });

    setNodes(allNodes);
    setEdges(allEdges);
  }, [tasks, processTask, setNodes, setEdges]);

  // 当任务数据变化时更新节点和边
  React.useEffect(() => {
    transformTasksToNodesAndEdges();
  }, [tasks, transformTasksToNodesAndEdges]);

  // 处理连线事件
  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;

      // 获取父节点和要移动的节点
      const parentNode = nodes.find(node => node.id === connection.source);
      const movingNode = nodes.find(node => node.id === connection.target);

      if (!parentNode || !movingNode) return;

      // 获取父任务和要移动的任务的路径
      const parentPath = parentNode.data.task.path;
      const movingPath = movingNode.data.task.path;

      // 检查是否尝试将任务移动到自身
      if (parentNode.id === movingNode.id) {
        return;
      }

      // 检查是否尝试将任务移动到其子任务
      if (movingPath.includes(parentNode.data.task.id)) {
        return;
      }

      // 执行任务移动
      onMoveTask(movingPath, parentPath);
    },
    [nodes, onMoveTask]
  );

  // 处理边的删除
  const onEdgesDelete = useCallback(
    (edgesToDelete: Edge[]) => {
      edgesToDelete.forEach(edge => {
        // 获取要移动的节点（target）和新的父节点（source）
        const movingNode = nodes.find(node => node.id === edge.target);
        const parentNode = nodes.find(node => node.id === edge.source);

        if (!movingNode || !parentNode) return;

        // 获取要移动的任务的路径
        const movingPath = movingNode.data.task.path;

        // 将任务移动到根节点
        onMoveTask(movingPath, [ROOT_TASK_ID]);
      });
    },
    [nodes, onMoveTask]
  );

  return (
    <Box sx={{ height: 'calc(100vh - 200px)', width: '100%' }}>
      <Paper elevation={3} sx={{ height: '100%', width: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgesDelete={onEdgesDelete}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          connectOnClick={true}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </Paper>
    </Box>
  );
};

export default TaskMindMap;
