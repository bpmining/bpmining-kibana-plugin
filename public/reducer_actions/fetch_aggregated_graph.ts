import { VisGraph } from '../../model/vis_types';
import { FETCH_PROCESS_DATA, FETCH_THIRD_PARTY_DATA } from '../../common/routes';
import { getSearchService } from '../services';
import { AnyAction, Dispatch } from 'redux';

export interface ResponseData {
  graph: VisGraph;
  caseIds: string[];
  caseCount: number;
}

export interface ServerResponse {
  data: ResponseData;
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

export const FETCH_AGGREGATED_GRAPH_SUCCESS = 'FETCH_AGGREGATED_GRAPH_SUCCESS';
export const FETCH_AGGREGATED_GRAPH_ERROR = 'FETCH_AGGREGATED_GRAPH_ERROR';

export function fetchAggregatedGraphSuccessAction(data: ResponseData) {
  return {
    type: FETCH_AGGREGATED_GRAPH_SUCCESS,
    graph: data.graph,
    caseIds: data.caseIds,
    caseCount: data.caseCount,
  };
}

export function fetchAggregatedGraphErrorAction(error: Error) {
  return {
    type: FETCH_AGGREGATED_GRAPH_ERROR,
    error: error,
  };
}

export const fetchAggregatedGraph = (metadata: MetaData, layer: number) => {
  return function (dispatch: Dispatch<AnyAction>) {
    if (layer === 1) {
      fetchProcessGraphAggregated(metadata)
        .then(
          function (data) {
            const action = fetchAggregatedGraphSuccessAction(data);
            dispatch(action);
          },
          (error) => {
            dispatch(fetchAggregatedGraphErrorAction(error));
          }
        )
        .catch((error) => {
          console.log(error);
          dispatch(fetchAggregatedGraphErrorAction(error));
        });
    } else if (layer === 2) {
      console.log('Fetch data for Layer 2');
      fetchThirdPartyGraphAggregated(metadata)
        .then(
          function (data) {
            const action = fetchAggregatedGraphSuccessAction(data);
            dispatch(action);
          },
          (error) => {
            dispatch(fetchAggregatedGraphErrorAction(error));
          }
        )
        .catch((error) => {
          dispatch(fetchAggregatedGraphErrorAction(error));
        });
    } else {
      throw new Error('Layer out of bounds (must be 1 or 2).');
    }
  };
};

async function fetchProcessGraphAggregated(metadata: MetaData) {
  console.log('Fetch aggregated process graph.');
  const router = getSearchService();
  return await router
    .post(FETCH_PROCESS_DATA, {
      body: JSON.stringify({
        index: metadata.index,
        filtersDsl: metadata.filter,
        timeFieldName: metadata.timeFieldName,
        timeRangeFrom: metadata.timeRangeFrom,
        timeRangeTo: metadata.timeRangeTo,
      }),
    })
    .then((response) => {
      const data = response.data;
      console.log(data);
      return data;
    });
}

export async function fetchThirdPartyGraphAggregated(metadata: MetaData) {
  console.log('Fetch aggregated third party graph');
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
      const data = response.data;
      console.log(data);
      return data;
    });
}
