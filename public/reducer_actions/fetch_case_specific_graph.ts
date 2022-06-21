import { VisGraph } from '../../model/vis_types';
import { FETCH_PROCESS_DATA_CASE, FETCH_THIRD_PARTY_DATA_CASE } from '../../common/routes';
import { getSearchService } from '../services';
import { VisNode } from '../types';
import { AnyAction, Dispatch } from 'redux';

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

export const FETCH_CASE_GRAPH_SUCCESS = 'FETCH_CASE_GRAPH_SUCCESS';
export const FETCH_CASE_GRAPH_ERROR = 'FETCH_CASE_GRAPH_ERROR';
export const UNSELECT_CASE = 'UNSELECT_CASE';

export function fetchCaseGraphSuccessAction(caseGraph: VisGraph) {
  return {
    type: FETCH_CASE_GRAPH_SUCCESS,
    graph: caseGraph,
  };
}

export function fetchCaseGraphErrorAction(error: Error) {
  return {
    type: FETCH_CASE_GRAPH_ERROR,
    error: error,
  };
}

export function unselectCaseAction() {
  return {
    type: UNSELECT_CASE,
  };
}

export const fetchCaseGraph = (metadata: MetaData, caseId: string, layer: number) => {
  return function (dispatch: Dispatch<AnyAction>) {
    if (layer === 1) {
      fetchProcessGraphCase(metadata, caseId)
        .then(
          function (caseGraph) {
            const action = fetchCaseGraphSuccessAction(caseGraph);
            dispatch(action);
          },
          (error) => {
            dispatch(fetchCaseGraphErrorAction(error));
          }
        )
        .catch((error) => {
          dispatch(fetchCaseGraphErrorAction(error));
        });
    } else if (layer === 2) {
      console.log('Fetch data for Layer 2');
      fetchThirdPartyGraphCase(metadata, caseId)
        .then(
          function (caseGraph) {
            const action = fetchCaseGraphSuccessAction(caseGraph);
            dispatch(action);
          },
          (error) => {
            dispatch(fetchCaseGraphErrorAction(error));
          }
        )
        .catch((error) => {
          dispatch(fetchCaseGraphErrorAction(error));
        });
    } else {
      throw new Error('Layer out of bounds (must be 1 or 2).');
    }
  };
};

async function fetchProcessGraphCase(metadata: MetaData, caseId: string) {
  console.log('Fetch process graph for case: ' + caseId);
  const router = getSearchService();
  return await router
    .post(FETCH_PROCESS_DATA_CASE, {
      body: JSON.stringify({
        index: metadata.index,
        filtersDsl: metadata.filter,
        timeFieldName: metadata.timeFieldName,
        timeRangeFrom: metadata.timeRangeFrom,
        timeRangeTo: metadata.timeRangeTo,
        caseID: caseId,
      }),
    })
    .then((response) => {
      const graph = response.data;
      console.log(graph);
      return graph;
    });
}

export async function fetchThirdPartyGraphCase(metadata: MetaData, caseId: string) {
  console.log('Fetch third party graph for case: ' + caseId);
  const router = getSearchService();
  return await router
    .post(FETCH_THIRD_PARTY_DATA_CASE, {
      body: JSON.stringify({
        index: metadata.index,
        filtersDsl: metadata.filter,
        timeFieldName: metadata.timeFieldName,
        timeRangeFrom: metadata.timeRangeFrom,
        timeRangeTo: metadata.timeRangeTo,
        caseID: caseId,
      }),
    })
    .then((response) => {
      const graph = response.data;
      console.log(graph);
      return graph;
    });
}
