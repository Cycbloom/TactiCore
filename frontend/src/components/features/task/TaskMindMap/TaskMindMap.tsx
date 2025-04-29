import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Background,
  MiniMap,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  Connection,
  Edge,
  Node,
  NodeChange,
  EdgeChange,
  OnNodesChange,
  OnEdgesChange
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Box, Paper } from '@mui/material';

import TaskNode from './TaskNode/TaskNode';
import MindMapControls from './MindMapControls';
import MindMapContextMenu from './MindMapContextMenu';
import { useMindMapLayout } from './useMindMapLayout';
import { useMindMapNodes } from './useMindMapNodes';

import { Task, TaskStatus } from '@/types/task';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    nodeId?: string;
  } | null>(null);

  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const { nodes, edges, setNodes, setEdges, nodesRef } = useMindMapNodes({
    tasks,
    onEditTask,
    onDeleteTask,
    onToggleStatus,
    onAddSubtask,
    onMoveTask
  });

  const { handleAutoLayout } = useMindMapLayout({
    nodes,
    setNodes,
    fitView
  });

  // 处理连线事件
  const onConnect = useCallback(
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
        onMoveTask(movingPath, []);
      });
    },
    [nodes, onMoveTask]
  );

  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    const target = event.target as HTMLElement;
    const nodeId = target.closest('.react-flow__node')?.getAttribute('data-id') || undefined;
    setContextMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
      nodeId
    });
  }, []);

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

  // 处理节点变化
  const onNodesChange: OnNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes(nds => {
        const newNodes = [...nds];
        changes.forEach(change => {
          if (change.type === 'position' && change.position) {
            const node = newNodes.find(n => n.id === change.id);
            if (node) {
              node.position = change.position;
            }
          }
        });
        return newNodes;
      });
    },
    [setNodes]
  );

  // 处理边变化
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges(eds => {
        const newEdges = [...eds];
        changes.forEach(change => {
          if (change.type === 'remove') {
            const index = newEdges.findIndex(e => e.id === change.id);
            if (index !== -1) {
              newEdges.splice(index, 1);
            }
          }
        });
        return newEdges;
      });
    },
    [setEdges]
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
            contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined
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
