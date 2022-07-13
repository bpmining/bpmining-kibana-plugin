import { VisGraph } from '../../model/vis_types';
import { FETCH_PROCESS_DATA, FETCH_THIRD_PARTY_DATA } from '../../common/routes';
import { getSearchService } from '../services';
import { AnyAction, Dispatch } from 'redux';
import { ServerRequestData } from '../components/app';

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

export const fetchAggregatedGraph = (serverRequestData: ServerRequestData, layer: number) => {
  return function (dispatch: Dispatch<AnyAction>) {
    if (layer === 1) {
      fetchProcessGraphAggregated(serverRequestData)
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
    } else if (layer === 2) {
      fetchThirdPartyGraphAggregated(serverRequestData)
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

async function fetchProcessGraphAggregated(serverRequestData: ServerRequestData) {
  const router = getSearchService();
  return await router
    .post(FETCH_PROCESS_DATA, {
      body: JSON.stringify({
        index: serverRequestData.index,
        filtersDsl: serverRequestData.filter,
        timeFieldName: serverRequestData.timeFieldName,
        timeRangeFrom: serverRequestData.timeRangeFrom,
        timeRangeTo: serverRequestData.timeRangeTo,
      }),
    })
    .then((response: any) => {
      const data = response.data;
      console.log(data);
      return data;
    });
}

export async function fetchThirdPartyGraphAggregated(serverRequestData: ServerRequestData) {
  const router = getSearchService();
  return await router
    .post(FETCH_THIRD_PARTY_DATA, {
      body: JSON.stringify({
        index: serverRequestData.index,
        filtersDsl: serverRequestData.filter,
        timeFieldName: serverRequestData.timeFieldName,
        timeRangeFrom: serverRequestData.timeRangeFrom,
        timeRangeTo: serverRequestData.timeRangeTo,
      }),
    })
    .then((response: any) => {
      const data = response.data;
      return data;
    });
}
