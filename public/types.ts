import { ResponseData } from './reducer_actions/fetch_case_specific_graph';

export interface ProcessGraphVisParams {
  indexPatternId: string;
}

export interface VisData {
  data: ResponseData;
  index: string;
  filter: any;
  timeFieldName: string;
  timeRangeFrom: any;
  timeRangeTo: any;
}
