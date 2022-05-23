import { AggExpressionType } from "src/plugins/data/common";

export interface ProcessGraphVisParams {
    indexPatternId: string;
    aggs?: AggExpressionType[];
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

export interface VisData {
    data: DataItem[];
}
