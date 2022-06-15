import { FETCH_PROCESS_DATA_CASE, FETCH_THIRD_PARTY_DATA_CASE } from '../../common/routes';
import { getSearchService } from '../services';
import { VisNode } from '../types';

export interface ResponseData {
  data: VisNode[];
  index: string;
  filter: any;
  timeFieldName: string;
  timeRangeFrom: any;
  timeRangeTo: any;
}

export interface MetaData {
  index: string;
  filter: any;
  timeFieldName: string;
  timeRangeFrom: any;
  timeRangeTo: any;
}

export async function fetchProcessGraphCase(metadata: MetaData, caseID: string) {
  console.log('Fetch aggregated process graph.');
  const router = getSearchService();
  return await router
    .post(FETCH_PROCESS_DATA_CASE, {
      body: JSON.stringify({
        index: metadata.index,
        filtersDsl: metadata.filter,
        timeFieldName: metadata.timeFieldName,
        timeRangeFrom: metadata.timeRangeFrom,
        timeRangeTo: metadata.timeRangeTo,
        caseID: caseID,
      }),
    })
    .then((response) => {
      const graph = response.data;
      console.log(graph);
      return graph;
    });
}

export async function fetchThirdPartyGraphCase(metadata: MetaData) {
  const router = getSearchService();
  return await router
    .post(FETCH_THIRD_PARTY_DATA_CASE, {
      body: JSON.stringify({
        index: metadata.index,
        filtersDsl: metadata.filter,
        timeFieldName: metadata.timeFieldName,
        timeRangeFrom: metadata.timeRangeFrom,
        timeRangeTo: metadata.timeRangeTo,
      }),
    })
    .then((response) => {
      const nodes = response.data;
      console.log(nodes);
      return nodes;
    });
}
