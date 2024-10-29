import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Node, Connection, SymbolType, LineType } from '../types';

export const usePedigreeCanvas = (width: number, height: number) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const drawSymbol = (
    context: CanvasRenderingContext2D,
    node: Node,
    size: number = 30
  ) => {
    context.beginPath();
    context.strokeStyle = '#000';
    context.fillStyle = node.isAffected ? '#000' : '#fff';
    context.lineWidth = 2;

    switch (node.type) {
      case 'male':
        context.rect(node.x - size/2, node.y - size/2, size, size);
        break;
      case 'female':
        context.arc(node.x, node.y, size/2, 0, Math.PI * 2);
        break;
      case 'unknown':
        context.moveTo(node.x, node.y - size/2);
        context.lineTo(node.x + size/2, node.y);
        context.lineTo(node.x, node.y + size/2);
        context.lineTo(node.x - size/2, node.y);
        context.closePath();
        break;
    }

    context.fill();
    context.stroke();

    if (node.isDeceased) {
      context.beginPath();
      context.moveTo(node.x - size/2, node.y - size/2);
      context.lineTo(node.x + size/2, node.y + size/2);
      context.stroke();
    }

    if (node.isProband) {
      context.beginPath();
      context.moveTo(node.x + size/2, node.y + size/2);
      context.lineTo(node.x + size/2 + 10, node.y + size/2);
      context.lineTo(node.x + size/2 + 10, node.y + size/2 + 10);
      context.stroke();
    }

    if (node.label) {
      context.fillStyle = '#000';
      context.textAlign = 'center';
      context.fillText(node.label, node.x, node.y + size + 20);
    }
  };

  const drawConnection = (
    context: CanvasRenderingContext2D,
    connection: Connection,
    sourceNode: Node,
    targetNode: Node
  ) => {
    context.beginPath();
    context.strokeStyle = '#000';
    context.lineWidth = 2;

    switch (connection.type) {
      case 'partner':
        context.moveTo(sourceNode.x + 15, sourceNode.y);
        context.lineTo(targetNode.x - 15, targetNode.y);
        break;
      case 'consanguineous':
        context.moveTo(sourceNode.x + 15, sourceNode.y);
        context.lineTo(targetNode.x - 15, targetNode.y);
        context.moveTo(sourceNode.x + 15, sourceNode.y + 3);
        context.lineTo(targetNode.x - 15, targetNode.y + 3);
        break;
      case 'parent-child':
        const midY = (sourceNode.y + targetNode.y) / 2;
        context.moveTo(sourceNode.x, sourceNode.y + 15);
        context.lineTo(sourceNode.x, midY);
        context.lineTo(targetNode.x, midY);
        context.lineTo(targetNode.x, targetNode.y - 15);
        break;
      case 'twins':
        context.moveTo(sourceNode.x, sourceNode.y + 15);
        context.lineTo(sourceNode.x, sourceNode.y + 30);
        context.moveTo(targetNode.x, targetNode.y + 15);
        context.lineTo(targetNode.x, targetNode.y + 30);
        context.moveTo(sourceNode.x, sourceNode.y + 30);
        context.lineTo(targetNode.x, targetNode.y + 30);
        break;
    }
    context.stroke();
  };

  const render = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    context.clearRect(0, 0, width, height);
    context.fillStyle = '#fff';
    context.fillRect(0, 0, width, height);

    connections.forEach(connection => {
      const source = nodes.find(n => n.id === connection.sourceId);
      const target = nodes.find(n => n.id === connection.targetId);
      if (source && target) {
        drawConnection(context, connection, source, target);
      }
    });

    nodes.forEach(node => drawSymbol(context, node));
  };

  useEffect(() => {
    render();
  }, [nodes, connections, width, height]);

  return {
    canvasRef,
    nodes,
    setNodes,
    connections,
    setConnections,
    selectedNode,
    setSelectedNode,
  };
};