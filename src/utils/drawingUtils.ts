import { Node } from '../types';

export function drawSymbol(ctx: CanvasRenderingContext2D, node: Node) {
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
}