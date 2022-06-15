export interface ProcessGraphVisParams {
  indexPatternId: string;
}

export interface VisData {
  data: VisNode[];
  index: string;
  filter: any;
  timeFieldName: string;
  timeRangeFrom: any;
  timeRangeTo: any;
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
