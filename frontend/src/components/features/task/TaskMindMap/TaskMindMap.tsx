import React, { useCallback, useState, useRef, useEffect, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  useNodesState,
  useEdgesState,
  Position,
  Connection,
  OnConnect,
  useReactFlow,
  ReactFlowProvider,
  Panel,
  MiniMap
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Box, Paper } from '@mui/material';

import { TaskNode } from './TaskNode';
import MindMapControls from './MindMapControls';
import MindMapContextMenu from './MindMapContextMenu';

import { Task, TaskStatus, ROOT_TASK_ID } from '@/types/task';

// 注册自定义节点
const nodeTypes = {
  taskNode: TaskNode
};

interface TaskMindMapProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskPath: string[]) => void;
  onToggleStatus: (taskPath: string[], newStatus: TaskStatus) => void;
  onAddSubtask: (parentId: string) => void;
  onMoveTask: (taskPath: string[], newTaskPath: string[]) => void;
}

const TaskMindMapContent: React.FC<TaskMindMapProps> = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onToggleStatus,
  onAddSubtask,
  onMoveTask
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    nodeId?: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const nodesRef = useRef(nodes);

  const { getNode, zoomIn, zoomOut, fitView } = useReactFlow();

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

  // 自动布局
  const handleAutoLayout = useCallback(() => {
    const newNodes = nodes.map((node, _index) => {
      const level = node.data.level;
      const siblings = nodes.filter(n => n.data.level === level);
      const siblingIndex = siblings.findIndex(n => n.id === node.id);
      const totalSiblings = siblings.length;

      return {
        ...node,
        position: {
          x: level * 300,
          y: (siblingIndex - (totalSiblings - 1) / 2) * 150
        }
      };
    });

    // 只有当节点位置确实需要更新时才更新
    const hasPositionChanged = newNodes.some((node, index) => {
      const oldNode = nodes[index];
      return node.position.x !== oldNode.position.x || node.position.y !== oldNode.position.y;
    });

    if (hasPositionChanged) {
      setNodes(newNodes);
      // 使用 requestAnimationFrame 替代 setTimeout 以获得更好的性能
      requestAnimationFrame(() => {
        fitView();
      });
    }
  }, [nodes, setNodes, fitView]);

  // 使用 useMemo 缓存节点的位置检查结果
  const shouldTriggerLayout = useMemo(() => {
    return nodes.length > 0 && nodes.every(node => node.position.x === 0 && node.position.y === 0);
  }, [nodes]);

  // 当节点数据变化时应用布局
  React.useEffect(() => {
    if (shouldTriggerLayout) {
      handleAutoLayout();
    }
  }, [shouldTriggerLayout, handleAutoLayout]);

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

  const handleContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      const target = event.target as HTMLElement;
      const nodeId = target.closest('.react-flow__node')?.getAttribute('data-id');
      const node = nodeId ? getNode(nodeId) : null;
      setContextMenu({
        mouseX: event.clientX,
        mouseY: event.clientY,
        nodeId: node?.id
      });
    },
    [getNode]
  );

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleAddSubtaskFromContext = useCallback(() => {
    if (contextMenu?.nodeId) {
      onAddSubtask(contextMenu.nodeId);
    }
    handleCloseContextMenu();
  }, [contextMenu, onAddSubtask, handleCloseContextMenu]);

  const handleEditTaskFromContext = useCallback(() => {
    if (contextMenu?.nodeId) {
      const node = nodes.find(n => n.id === contextMenu.nodeId);
      if (node) {
        onEditTask(node.data.task);
      }
    }
    handleCloseContextMenu();
  }, [contextMenu, nodes, onEditTask, handleCloseContextMenu]);

  const handleDeleteTaskFromContext = useCallback(() => {
    if (contextMenu?.nodeId) {
      const node = nodes.find(n => n.id === contextMenu.nodeId);
      if (node) {
        onDeleteTask(node.data.task.path);
      }
    }
    handleCloseContextMenu();
  }, [contextMenu, nodes, onDeleteTask, handleCloseContextMenu]);

  // 搜索节点
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      const matchingNodes = nodes.filter(node =>
        node.data.task.title.toLowerCase().includes(query.toLowerCase())
      );
      if (matchingNodes.length > 0) {
        fitView({ nodes: matchingNodes, padding: 0.2 });
      }
    },
    [nodes, fitView]
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
          onContextMenu={handleContextMenu}
          minZoom={0.1}
          maxZoom={2}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#b1b1b7' }
          }}
        >
          <Background />
          <MiniMap />
          <Panel position="top-left">
            <MindMapControls
              searchQuery={searchQuery}
              onSearch={handleSearch}
              onAutoLayout={handleAutoLayout}
              onZoomIn={zoomIn}
              onZoomOut={zoomOut}
              onFitView={fitView}
            />
          </Panel>
        </ReactFlow>
        <MindMapContextMenu
          open={contextMenu !== null}
          anchorPosition={
            contextMenu?.mouseX && contextMenu?.mouseY
              ? {
                  top: contextMenu.mouseY,
                  left: contextMenu.mouseX
                }
              : undefined
          }
          onClose={handleCloseContextMenu}
          onAddSubtask={handleAddSubtaskFromContext}
          onEditTask={handleEditTaskFromContext}
          onDeleteTask={handleDeleteTaskFromContext}
        />
      </Paper>
    </Box>
  );
};

const TaskMindMap: React.FC<TaskMindMapProps> = props => {
  return (
    <ReactFlowProvider>
      <TaskMindMapContent {...props} />
    </ReactFlowProvider>
  );
};

export default TaskMindMap;
