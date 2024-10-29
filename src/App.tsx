import { useState } from 'react';
import { PedigreeCanvas } from './components/PedigreeCanvas';
import { Toolbar } from './components/Toolbar';
import { FileMenu } from './components/FileMenu';
import { DNA } from 'lucide-react';
import { Node } from './types';

function App() {
  const [selectedTool, setSelectedTool] = useState('male');
  const [mode, setMode] = useState<'draw' | 'connect'>('draw');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const handleNodePropertyChange = (property: string, value: boolean) => {
    if (!selectedNode) return;
    setSelectedNode({ ...selectedNode, [property]: value });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DNA className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">QuickPed Editor</h1>
            </div>
            <FileMenu />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4">
          <Toolbar 
            selectedTool={selectedTool} 
            onToolSelect={setSelectedTool}
            mode={mode}
            onModeChange={setMode}
            selectedNode={selectedNode}
            onNodePropertyChange={handleNodePropertyChange}
          />
          <div className="flex-1 bg-white rounded-lg shadow-lg p-4">
            <PedigreeCanvas 
              selectedTool={selectedTool}
              mode={mode}
              onNodeSelect={setSelectedNode}
              selectedNode={selectedNode}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;