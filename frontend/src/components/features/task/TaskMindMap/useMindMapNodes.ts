import { useCallback, useState, useRef, useEffect } from 'react';
import { Node, Edge, Position } from 'reactflow';

import { Task, TaskStatus } from '@/types/task';

interface UseMindMapNodesProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskPath: string[]) => void;
  onToggleStatus: (taskPath: string[], newStatus: TaskStatus) => void;
  onAddSubtask: (parentId: string) => void;
  onMoveTask: (taskPath: string[], newTaskPath: string[]) => void;
}

export const useMindMapNodes = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onToggleStatus,
  onAddSubtask,
  onMoveTask
}: UseMindMapNodesProps) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
  const nodesRef = useRef(nodes);

  // 更新ref
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  // 递归处理任务及其子任务
  const processTask = useCallback(
    (task: Task, level: number = 0, _index: number = 0) => {
      const nodes: Node[] = [];
      const edges: Edge[] = [];

      // 检查当前节点是否被折叠
      const isCollapsed = collapsedNodes.has(task.id);
      const hasChildren = task.children && task.children.length > 0;

      // 创建当前任务节点
      nodes.push({
        id: task.id,
        data: {
          label: task.title,
          task,
          onEdit: () => onEditTask(task),
          onDelete: () => onDeleteTask(task.path),
          onToggleStatus: (status: TaskStatus) => onToggleStatus(task.path, status),
          onAddSubtask: () => onAddSubtask(task.id),
          onToggleCollapse: () => {
            setCollapsedNodes(prev => {
              const newSet = new Set(prev);
              if (newSet.has(task.id)) {
                newSet.delete(task.id);
              } else {
                newSet.add(task.id);
              }
              return newSet;
            });
          },
          isCollapsed,
          hasChildren,
          level
        },
        position: {
          x: 0,
          y: 0
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

      // 如果节点没有被折叠，递归处理子任务
      if (!isCollapsed && task.children && task.children.length > 0) {
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
    [onEditTask, onDeleteTask, onToggleStatus, onAddSubtask, collapsedNodes]
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
  }, [tasks, processTask]);

  // 当任务数据变化时更新节点和边
  useEffect(() => {
    transformTasksToNodesAndEdges();
  }, [tasks, transformTasksToNodesAndEdges]);

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    nodesRef
  };
};
