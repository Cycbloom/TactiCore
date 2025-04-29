import { useCallback } from 'react';
import { Node } from 'reactflow';

interface UseMindMapLayoutProps {
  nodes: Node[];
  setNodes: (nodes: Node[]) => void;
  fitView: () => void;
}

export const useMindMapLayout = ({ nodes, setNodes, fitView }: UseMindMapLayoutProps) => {
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
    setNodes(newNodes);
    fitView();
  }, [nodes, setNodes, fitView]);

  return {
    handleAutoLayout
  };
};
