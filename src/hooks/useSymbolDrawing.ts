import { useCallback } from 'react';
import { Node, SymbolType } from '../types';

export const useSymbolDrawing = () => {
  const drawSymbol = useCallback((
    ctx: CanvasRenderingContext2D,
    node: Node,
    isSelected: boolean = false
  ) => {
    const size = 30;
    ctx.beginPath();
    ctx.strokeStyle = isSelected ? '#4299e1' : '#000';
    ctx.fillStyle = node.isAffected ? '#000' : '#fff';
    ctx.lineWidth = 2;

    // Draw main symbol
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

    // Draw deceased line
    if (node.isDeceased) {
      ctx.beginPath();
      ctx.moveTo(node.x - size/2 - 5, node.y - size/2 - 5);
      ctx.lineTo(node.x + size/2 + 5, node.y + size/2 + 5);
      ctx.stroke();
    }

    // Draw premature death triangle
    if (node.isPrematureDeath) {
      ctx.beginPath();
      ctx.fillStyle = '#000';
      ctx.moveTo(node.x - 8, node.y + size/2 + 8);
      ctx.lineTo(node.x + 8, node.y + size/2 + 8);
      ctx.lineTo(node.x, node.y + size/2 + 16);
      ctx.closePath();
      ctx.fill();
    }

    // Draw proband arrow
    if (node.isProband) {
      ctx.beginPath();
      ctx.moveTo(node.x + size/2 + 5, node.y + size/2 + 5);
      ctx.lineTo(node.x + size/2 + 15, node.y + size/2 + 5);
      ctx.lineTo(node.x + size/2 + 15, node.y + size/2 + 15);
      ctx.stroke();
    }

    // Draw selection highlight
    if (isSelected) {
      ctx.beginPath();
      ctx.strokeStyle = '#4299e1';
      ctx.setLineDash([5, 5]);
      ctx.rect(node.x - size/2 - 5, node.y - size/2 - 5, size + 10, size + 10);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, []);

  return { drawSymbol };
};