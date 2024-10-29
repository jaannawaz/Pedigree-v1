import { useRef, useEffect, useState } from 'react';
import { Node, Connection } from '../types';

interface PedigreeCanvasProps {
  selectedTool: string;
  mode: 'draw' | 'connect';
}

export function PedigreeCanvas({ selectedTool, mode }: PedigreeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [connectingNode, setConnectingNode] = useState<Node | null>(null);
  const [labelingNode, setLabelingNode] = useState<Node | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    context.scale(dpr, dpr);

    renderCanvas();
  }, [nodes, connections]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    drawGrid(context, canvas.width, canvas.height);

    // Draw connections
    connections.forEach(connection => {
      const source = nodes.find(n => n.id === connection.sourceId);
      const target = nodes.find(n => n.id === connection.targetId);
      if (source && target) {
        drawConnection(context, connection, source, target);
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      drawSymbol(context, node);
      if (node.label) {
        drawLabel(context, node);
      }
    });
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.beginPath();
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;

    for (let x = 0; x < width; x += 20) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }

    for (let y = 0; y < height; y += 20) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }

    ctx.stroke();
  };

  const drawSymbol = (ctx: CanvasRenderingContext2D, node: Node) => {
    const size = 30;
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.fillStyle = node.isAffected ? '#000' : '#fff';
    ctx.lineWidth = 2;

    switch (node.type) {
      case 'male':
        ctx.rect(node.x - size/2, node.y - size/2, size, size);
        break;
      case 'female':
        ctx.arc(node.x, node.y, size/2, 0, Math.PI * 2);
        break;
      case 'unknown':
        ctx.moveTo(node.x, node.y - size/2);
        ctx.lineTo(node.x + size/2, node.y);
        ctx.lineTo(node.x, node.y + size/2);
        ctx.lineTo(node.x - size/2, node.y);
        ctx.closePath();
        break;
    }

    ctx.fill();
    ctx.stroke();

    if (node.isDeceased) {
      ctx.beginPath();
      ctx.moveTo(node.x - size/2, node.y - size/2);
      ctx.lineTo(node.x + size/2, node.y + size/2);
      ctx.stroke();
    }

    if (node.isPrematureDeath) {
      ctx.beginPath();
      ctx.moveTo(node.x - 10, node.y + size/2 + 10);
      ctx.lineTo(node.x, node.y + size/2 + 20);
      ctx.lineTo(node.x + 10, node.y + size/2 + 10);
      ctx.closePath();
      ctx.fill();
    }

    if (node.isProband) {
      ctx.beginPath();
      ctx.moveTo(node.x + size/2, node.y + size/2);
      ctx.lineTo(node.x + size/2 + 10, node.y + size/2);
      ctx.lineTo(node.x + size/2 + 10, node.y + size/2 + 10);
      ctx.stroke();
    }
  };

  const drawConnection = (
    ctx: CanvasRenderingContext2D,
    connection: Connection,
    source: Node,
    target: Node
  ) => {
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;

    switch (connection.type) {
      case 'partner':
        ctx.moveTo(source.x + 15, source.y);
        ctx.lineTo(target.x - 15, target.y);
        break;
      case 'consanguineous':
        ctx.moveTo(source.x + 15, source.y);
        ctx.lineTo(target.x - 15, target.y);
        ctx.moveTo(source.x + 15, source.y + 3);
        ctx.lineTo(target.x - 15, target.y + 3);
        break;
      case 'parent-child':
        const midY = (source.y + target.y) / 2;
        ctx.moveTo(source.x, source.y + 15);
        ctx.lineTo(source.x, midY);
        ctx.lineTo(target.x, midY);
        ctx.lineTo(target.x, target.y - 15);
        break;
      case 'twins':
        const y = Math.min(source.y, target.y) + 15;
        ctx.moveTo(source.x, source.y + 15);
        ctx.lineTo(source.x, y + 15);
        ctx.moveTo(target.x, target.y + 15);
        ctx.lineTo(target.x, y + 15);
        ctx.moveTo(source.x, y + 15);
        ctx.lineTo(target.x, y + 15);
        break;
    }
    ctx.stroke();
  };

  const drawLabel = (ctx: CanvasRenderingContext2D, node: Node) => {
    if (!node.label) return;
    ctx.font = '12px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.fillText(node.label, node.x, node.y + 25);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const generation = Math.floor(y / 100);

    if (mode === 'draw') {
      const newNode: Node = {
        id: Date.now().toString(),
        type: selectedTool as 'male' | 'female' | 'unknown',
        x,
        y,
        generation,
        isAffected: false,
        isDeceased: false,
        isPrematureDeath: false,
        isProband: false
      };
      setNodes([...nodes, newNode]);
    } else if (mode === 'connect') {
      const clickedNode = findNodeAtPosition(x, y);
      if (clickedNode) {
        if (!connectingNode) {
          setConnectingNode(clickedNode);
        } else if (clickedNode.id !== connectingNode.id) {
          const newConnection: Connection = {
            id: Date.now().toString(),
            sourceId: connectingNode.id,
            targetId: clickedNode.id,
            type: 'parent-child'
          };
          setConnections([...connections, newConnection]);
          setConnectingNode(null);
        }
      }
    }
  };

  const findNodeAtPosition = (x: number, y: number): Node | null => {
    const size = 30;
    return nodes.find(node => {
      const dx = Math.abs(node.x - x);
      const dy = Math.abs(node.y - y);
      return dx <= size/2 && dy <= size/2;
    }) || null;
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-[600px] border border-gray-200 rounded cursor-crosshair"
      onClick={handleCanvasClick}
    />
  );
}