import React, { useRef, useEffect, useState } from 'react';
import { useSymbolDrawing } from '../hooks/useSymbolDrawing';
import { useConnectionDrawing } from '../hooks/useConnectionDrawing';
import { Node, Connection, SymbolType } from '../types';

interface CanvasProps {
  width: number;
  height: number;
}

export const Canvas: React.FC<CanvasProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const { drawSymbol, createNode } = useSymbolDrawing();
  const { drawConnection } = useConnectionDrawing();

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const generation = Math.floor(y / 100);

    const newNode = createNode('male', x, y, generation);
    setNodes([...nodes, newNode]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    // Set up canvas
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.scale(pixelRatio, pixelRatio);

    // Clear and draw
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);

    // Draw connections
    connections.forEach(connection => {
      const source = nodes.find(n => n.id === connection.sourceId);
      const target = nodes.find(n => n.id === connection.targetId);
      if (source && target) {
        drawConnection(context, connection, source, target);
      }
    });

    // Draw nodes
    nodes.forEach(node => drawSymbol(context, node));
  }, [width, height, nodes, connections, drawSymbol, drawConnection]);

  return (
    <canvas
      ref={canvasRef}
      onClick={handleCanvasClick}
      className="border border-gray-300 bg-white shadow-lg cursor-crosshair"
    />
  );
};