import _ from 'lodash';
import { AnyAction, Dispatch } from 'redux';
import { ServerRequestData } from './fetch_case_specific_graph';
import { getSearchService } from '../services';
import { FETCH_CYCLE_TIME_DATA } from '../../common/routes';

export const GET_CYCLE_TIME_DATA_SUCCESS = 'GET_CYCLE_TIME_DATA_SUCCESS';
export const GET_CYCLE_TIME_DATA_ERROR = 'GET_CYCLE_TIME_DATA_ERROR';
export const SELECT_CYCLE_TIME_CASES = 'SELECT_CYCLE_TIME_CASES';
export const UNSELECT_CYCLE_TIME_CASES = 'UNSELECT_CYCLE_TIME_CASES';

export interface CycleTimeGroup {
  caseIds: string[];
  timeInterval: string;
}

export function getCycleTimeDataSuccessAction(cycleTimeGroups: CycleTimeGroup[]) {
  return {
    type: GET_CYCLE_TIME_DATA_SUCCESS,
    cycleTimeGroups: cycleTimeGroups,
  };
}

export function getCycleTimeDataErrorAction(error: Error) {
  return {
    type: GET_CYCLE_TIME_DATA_ERROR,
    error: error,
  };
}

export function selectCaseAction(selectedCases: any) {
  return {
    type: SELECT_CYCLE_TIME_CASES,
    selectedCycleTimeCases: selectedCases,
  };
}

export function unselectCaseAction() {
  return {
    type: UNSELECT_CYCLE_TIME_CASES,
  };
}

export const getCycleTimeData = (serverRequestData: ServerRequestData) => {
  return async function (dispatch: Dispatch<AnyAction>) {
    getCycleTimeGroups(serverRequestData)
      .then(
        function (data) {
          const action = getCycleTimeDataSuccessAction(data.cycleTimeGroups);
          dispatch(action);
        },
        (error) => {
          dispatch(getCycleTimeDataErrorAction(error));
        }
      )
      .catch((error) => {
        dispatch(getCycleTimeDataErrorAction(error));
      });
  };
};

async function getCycleTimeGroups(serverRequestData: ServerRequestData) {
  const router = getSearchService();
  return await router
    .post(FETCH_CYCLE_TIME_DATA, {
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
