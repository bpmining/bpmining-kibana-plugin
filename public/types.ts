export interface ProcessGraphVisParams {
  indexPatternId: string;
}

export interface VisData {
  data: VisNode[];
}

export interface VisNode {
  label: string;
  caseID: string;

  startTime?: number;
  endTime?: number;

  system?: string;
  typ?: 'process' | 'third-party';
  contextInfo?: object;
}

export interface VisEdge {
  from: number;
  to: number;
}
