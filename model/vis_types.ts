export interface VisNode{
    
    timestamp: number;
    label: string;
    caseID: string;
  
    startTime?: number;
    endTime?: number;
  
    system?: string;
    typ?: 'process' | 'third-party';
    contextInfo?: object | Array<any>;

    id: number;
    throughputTime?: Date;
    meanThroughputTime?: number;
    totalThroughputTime?: string;
    minThroughputTime?: string;
    maxThroughputTime?: string;
    frequency?: number ;
    thirdPartyData?: VisNode[];
    drillDownGraph?: VisGraph;
}

export interface VisEdge {
    from: number;
    to: number;
    label?: string;
  }

  export interface VisGraph {
    nodes: VisNode[];
    edges: VisEdge[];
  }