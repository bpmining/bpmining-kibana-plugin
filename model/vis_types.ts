export interface VisNode{
    timestamp: number;
    label: string;
    caseID: string;
  
    startTime?: number;
    endTime?: number;
  
    system?: string;
    typ?: 'process' | 'third-party';
    contextInfo?: object;

    id: number;
    throughputTime?: Date;
}

export interface VisEdge {
    from: number;
    to: number;
  }

  export interface VisGraph {
    nodes: VisNode[];
    edges: VisEdge[];
  }