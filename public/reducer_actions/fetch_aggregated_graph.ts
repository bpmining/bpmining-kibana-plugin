import { FETCH_PROCESS_DATA, FETCH_THIRD_PARTY_DATA } from '../../common/routes';
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

export function fetchAggregatedProcessGraph() {
  console.log('Fetch aggregated process graph.');
  const router = getSearchService();
}

export async function fetchAggregatedThirdPartyGraph(metadata: MetaData) {
  const router = getSearchService();
  return await router
    .post(FETCH_THIRD_PARTY_DATA, {
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
