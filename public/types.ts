import { VisNode } from '../model/vis_types';

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
