import { Square, Circle, HelpCircle, Link, Pencil, UserPlus, GitFork, ArrowDown } from 'lucide-react';

interface ToolbarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  mode: 'draw' | 'connect';
  onModeChange: (mode: 'draw' | 'connect') => void;
  selectedNode: any | null;
  onNodePropertyChange: (property: string, value: boolean) => void;
}

export function Toolbar({ 
  selectedTool, 
  onToolSelect, 
  mode, 
  onModeChange,
  selectedNode,
  onNodePropertyChange
}: ToolbarProps) {
  const tools = [
    { id: 'male', icon: Square, label: 'Male' },
    { id: 'female', icon: Circle, label: 'Female' },
    { id: 'unknown', icon: HelpCircle, label: 'Unknown' },
  ];

  const connectionTypes = [
    { id: 'parent-child', icon: ArrowDown, label: 'Parent-Child' },
    { id: 'partner', icon: Link, label: 'Partner' },
    { id: 'consanguineous', icon: UserPlus, label: 'Consanguineous' },
    { id: 'twins', icon: GitFork, label: 'Twins' },
  ];

  return (
    <div className="flex flex-col gap-4 bg-white p-4 rounded-lg shadow-lg h-fit min-w-[200px]">
      <div className="flex gap-2 mb-4">
        <button
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === 'draw' 
              ? 'bg-blue-100 text-blue-700' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => onModeChange('draw')}
        >
          <Pencil className="w-4 h-4 mx-auto" />
          <span className="text-xs mt-1">Draw</span>
        </button>
        <button
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === 'connect'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => onModeChange('connect')}
        >
          <Link className="w-4 h-4 mx-auto" />
          <span className="text-xs mt-1">Connect</span>
        </button>
      </div>

      {mode === 'draw' ? (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Symbols</h3>
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => onToolSelect(tool.id)}
                className={`w-full p-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 ${
                  selectedTool === tool.id ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                }`}
                title={tool.label}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{tool.label}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Connections</h3>
          {connectionTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => onToolSelect(type.id)}
                className={`w-full p-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 ${
                  selectedTool === type.id ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                }`}
                title={type.label}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{type.label}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Properties</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="rounded text-blue-600"
              checked={selectedNode?.isAffected || false}
              onChange={(e) => onNodePropertyChange('isAffected', e.target.checked)}
              disabled={!selectedNode}
            />
            <span className="text-sm text-gray-700">Affected</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="rounded text-blue-600"
              checked={selectedNode?.isDeceased || false}
              onChange={(e) => onNodePropertyChange('isDeceased', e.target.checked)}
              disabled={!selectedNode}
            />
            <span className="text-sm text-gray-700">Deceased</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="rounded text-blue-600"
              checked={selectedNode?.isProband || false}
              onChange={(e) => onNodePropertyChange('isProband', e.target.checked)}
              disabled={!selectedNode}
            />
            <span className="text-sm text-gray-700">Proband</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="rounded text-blue-600"
              checked={selectedNode?.isPrematureDeath || false}
              onChange={(e) => onNodePropertyChange('isPrematureDeath', e.target.checked)}
              disabled={!selectedNode}
            />
            <span className="text-sm text-gray-700">Premature Death</span>
          </label>
        </div>
      </div>
    </div>
  );
}