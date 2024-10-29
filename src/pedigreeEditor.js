export class PedigreeEditor {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.nodes = [];
    this.connections = [];
    this.mode = 'draw';
    this.selectedSymbol = 'male';
    this.selectedNode = null;
    this.isDragging = false;

    this.setupCanvas();
    this.addEventListeners();
    this.render();
  }

  setupCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  addEventListeners() {
    this.canvas.addEventListener('click', this.handleClick.bind(this));
    window.addEventListener('resize', () => {
      this.setupCanvas();
      this.render();
    });
  }

  setMode(mode) {
    this.mode = mode;
  }

  setSymbol(symbol) {
    this.selectedSymbol = symbol;
  }

  handleClick(e) {
    if (this.mode !== 'draw') return;

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.nodes.push({
      id: Date.now().toString(),
      type: this.selectedSymbol,
      x,
      y,
      isAffected: false,
      isDeceased: false
    });

    this.render();
  }

  drawSymbol(node) {
    const size = 30;
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#000';
    this.ctx.fillStyle = node.isAffected ? '#000' : '#fff';
    this.ctx.lineWidth = 2;

    switch (node.type) {
      case 'male':
        this.ctx.rect(node.x - size/2, node.y - size/2, size, size);
        break;
      case 'female':
        this.ctx.arc(node.x, node.y, size/2, 0, Math.PI * 2);
        break;
      case 'unknown':
        this.ctx.moveTo(node.x, node.y - size/2);
        this.ctx.lineTo(node.x + size/2, node.y);
        this.ctx.lineTo(node.x, node.y + size/2);
        this.ctx.lineTo(node.x - size/2, node.y);
        this.ctx.closePath();
        break;
    }

    this.ctx.fill();
    this.ctx.stroke();

    if (node.isDeceased) {
      this.ctx.beginPath();
      this.ctx.moveTo(node.x - size/2, node.y - size/2);
      this.ctx.lineTo(node.x + size/2, node.y + size/2);
      this.ctx.stroke();
    }
  }

  drawGrid() {
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#f0f0f0';
    this.ctx.lineWidth = 1;

    for (let x = 0; x < this.canvas.width; x += 20) {
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
    }

    for (let y = 0; y < this.canvas.height; y += 20) {
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
    }

    this.ctx.stroke();
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawGrid();
    
    this.connections.forEach(conn => {
      const source = this.nodes.find(n => n.id === conn.sourceId);
      const target = this.nodes.find(n => n.id === conn.targetId);
      if (source && target) {
        this.drawConnection(conn, source, target);
      }
    });

    this.nodes.forEach(node => this.drawSymbol(node));
  }

  exportData() {
    return {
      nodes: this.nodes,
      connections: this.connections
    };
  }
}