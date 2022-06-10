export interface ProcessEvent {
    timestamp: number;
    label: string;
    caseID: string;
  
    startTime?: number;
    endTime?: number;
  
    system?: string;
    typ?: 'process' | 'third-party';
    contextInfo?: object;
  }