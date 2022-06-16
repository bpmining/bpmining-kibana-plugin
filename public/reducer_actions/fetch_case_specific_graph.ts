import { VisGraphProps } from '../../model/vis_types';
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

export const FETCH_CASE_GRAPH_SUCCESS = 'FETCH_CASE_GRAPH_SUCCESS';
export const FETCH_CASE_GRAPH_ERROR = 'FETCH_CASE_GRAPH_ERROR';
export const UNSELECT_CASE = 'UNSELECT_CASE';

export function fetchCaseGraphSuccessAction(caseGraph: VisGraphProps) {
  return {
    type: FETCH_CASE_GRAPH_SUCCESS,
    graph: caseGraph,
  };
}

export function fetchCaseGraphErrorAction(error: any) {
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

export const fetchCaseGraph = (metadata: MetaData, caseId: string) => {
  return function (dispatch) {
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
  };
};

async function fetchProcessGraphCase(metadata: MetaData, caseId: string) {
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
        caseID: caseId,
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
