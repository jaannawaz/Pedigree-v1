export type SymbolType = 'male' | 'female' | 'unknown';
export type ConnectionType = 'parent-child' | 'partner' | 'consanguineous' | 'twins';

export interface Node {
  id: string;
  type: SymbolType;
  x: number;
  y: number;
  generation: number;
  isAffected: boolean;
  isDeceased: boolean;
  isPrematureDeath: boolean;
  isProband: boolean;
  label?: string;
}

export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  type: ConnectionType;
}

export interface PedigreeData {
  nodes: Node[];
  connections: Connection[];
}