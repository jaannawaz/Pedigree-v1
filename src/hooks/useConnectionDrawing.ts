import { useCallback } from 'react';
import { Connection, Node } from '../types';

export const useConnectionDrawing = () => {
  const drawConnection = useCallback((
    ctx: CanvasRenderingContext2D,
    connection: Connection,
    source: Node,
    target: Node,
    isSelected: boolean = false
  ) => {
    ctx.beginPath();
    ctx.strokeStyle = isSelected ? '#4299e1' : '#000';
    ctx.lineWidth = 2;

    switch (connection.type) {
      case 'partner':
        // Horizontal line between partners
        ctx.moveTo(source.x + 15, source.y);
        ctx.lineTo(target.x - 15, target.y);
        break;

      case 'consanguineous':
        // Double horizontal line for blood relatives
        ctx.moveTo(source.x + 15, source.y);
        ctx.lineTo(target.x - 15, target.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(source.x + 15, source.y + 3);
        ctx.lineTo(target.x - 15, target.y + 3);
        break;

      case 'parent-child':
        // Vertical line from parent to child with horizontal connector
        const midY = (source.y + target.y) / 2;
        ctx.moveTo(source.x, source.y + 15);
        ctx.lineTo(source.x, midY);
        ctx.lineTo(target.x, midY);
        ctx.lineTo(target.x, target.y - 15);
        break;

      case 'twins':
        // Horizontal line connecting twins with vertical supports
        const y = Math.min(source.y, target.y) + 15;
        // Vertical lines
        ctx.moveTo(source.x, source.y + 15);
        ctx.lineTo(source.x, y + 15);
        ctx.moveTo(target.x, target.y + 15);
        ctx.lineTo(target.x, y + 15);
        // Horizontal connector
        ctx.moveTo(source.x, y + 15);
        ctx.lineTo(target.x, y + 15);
        break;
    }
    ctx.stroke();

    // Draw selection highlight
    if (isSelected) {
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.strokeStyle = '#4299e1';
      switch (connection.type) {
        case 'partner':
        case 'consanguineous':
          ctx.rect(
            source.x + 15,
            source.y - 10,
            target.x - source.x - 30,
            20
          );
          break;
        case 'parent-child':
          const midY = (source.y + target.y) / 2;
          ctx.rect(
            Math.min(source.x, target.x) - 10,
            source.y + 15,
            Math.abs(target.x - source.x) + 20,
            target.y - source.y - 30
          );
          break;
        case 'twins':
          const y = Math.min(source.y, target.y) + 15;
          ctx.rect(
            Math.min(source.x, target.x) - 10,
            y,
            Math.abs(target.x - source.x) + 20,
            30
          );
          break;
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, []);

  return { drawConnection };
};