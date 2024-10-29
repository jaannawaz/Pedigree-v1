import React, { useRef } from 'react';
import { PedigreeData } from '../types';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pedigreeData: PedigreeData;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  pedigreeData,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleExportPNG = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'pedigree.png';
    link.href = dataUrl;
    link.click();
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(pedigreeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.download = 'pedigree.json';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Export Pedigree</h2>
        <div className="space-y-4">
          <button
            onClick={handleExportPNG}
            className="w-full btn btn-primary"
          >
            Export as PNG
          </button>
          <button
            onClick={handleExportJSON}
            className="w-full btn btn-secondary"
          >
            Export as JSON
          </button>
          <button
            onClick={onClose}
            className="w-full btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};