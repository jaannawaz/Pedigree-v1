import { Download, Upload, FileJson } from 'lucide-react';

export function FileMenu() {
  return (
    <div className="flex gap-2">
      <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
        <Upload className="w-4 h-4" />
        Import
      </button>
      <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
        <Download className="w-4 h-4" />
        Export Image
      </button>
      <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
        <FileJson className="w-4 h-4" />
        Export Data
      </button>
    </div>
  );
}