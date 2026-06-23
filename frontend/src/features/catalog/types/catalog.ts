export interface Source {
  id: number;
  name: string;
  type?: string;
}

export interface Dataset {
  id: number;
  name: string;
  type?: string;
  description?: string;
  format?: string;
  locationPointer?: string;
  recordCount?: number;
  sourceId?: number;
  source?: Source;
}

export interface DatasetInput {
  name: string;
  type?: string;
  description?: string;
  format?: string;
  locationPointer?: string;
  recordCount?: number;
  sourceId?: number;
}

export interface Model {
  id: number;
  name: string;
  architecture?: string;
  scheme?: string;
}

export interface DocumentItem {
  id: number;
  title: string;
  type?: string;
}

export interface GraphNode {
  id: string;
  label: string;
  caption: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: string;
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
