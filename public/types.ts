

export interface ProcessGraphVisParams {
  indexPatternId: string;
}

export interface VisData {
  data: VisNode[];
}

interface VisNode {
  label: string;
  caseID: string;

  startTime?: number;
  endTime?: number;

  system?: string;
  typ?: 'process' | 'third-party';
  contextInfo?: object;
}

export interface Node {
  id: string;
  label: string;
}

export interface Edge {
  from: string;
  to: string;
}

export interface DataItem {
  id: number;
  label: string;
}


