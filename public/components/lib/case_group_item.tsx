import { EuiPanel } from '@elastic/eui';
import React from 'react';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RootReducer } from '../../reducer/root_reducer';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import * as fetchCaseGraphActions from '../../reducer_actions/fetch_case_specific_graph';
import { ServerRequestData } from '../app';

interface CaseGroupProps {
  serverRequestData: ServerRequestData;
  caseId: string;
  cycleTime: string;
  rootReducer: RootReducer;
  fetchCaseGraphAction: Function;
  selectCaseAction: Function;
}
interface CaseGroupState {
  rootReducer: RootReducer;
}

const mapStateToProps = (state: CaseGroupState) => {
  return state;
};

const CaseGroupComponent = (props: CaseGroupProps) => {
  const caseId = props.caseId;
  const cycleTime = props.cycleTime;
  const { fetchCaseGraphAction, selectCaseAction } = props;
  const layer = props.rootReducer.layer.selectedLayer;

  return (
    <div style={{ margin: '15px 0px' }}>
      <EuiPanel
        onClick={() => {
          fetchCaseGraphAction(props.serverRequestData, caseId, layer);
          selectCaseAction({ label: caseId });
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {caseId}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <AccessTimeIcon style={{ width: '23px', height: '23px', margin: '0px 10px 0px 0px' }} />
            {cycleTime}
          </div>
        </div>
      </EuiPanel>
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return bindActionCreators(
    {
      fetchCaseGraphAction: fetchCaseGraphActions.fetchCaseGraph,
      selectCaseAction: fetchCaseGraphActions.selectCaseAction,
    },
    dispatch
  );
};

const connectedCaseGroupComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(CaseGroupComponent);
export { connectedCaseGroupComponent as CaseGroupComponent };
