import { PedigreeEditor } from './pedigreeEditor.js';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('pedigreeCanvas');
  const editor = new PedigreeEditor(canvas);

  // Mode buttons
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      editor.setMode(btn.dataset.mode);
    });
  });

  // Symbol buttons
  document.querySelectorAll('.symbol-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.symbol-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      editor.setSymbol(btn.dataset.symbol);
    });
  });

  // Export buttons
  document.getElementById('exportImageBtn').addEventListener('click', () => {
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'pedigree.png';
    link.href = dataUrl;
    link.click();
  });

  document.getElementById('exportDataBtn').addEventListener('click', () => {
    const data = editor.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'pedigree.json';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  });
});