import React from 'react';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RootReducer } from '../../reducer/root_reducer';
import { ServerRequestData } from '../app';
import { Paper } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { NODE_COLOR_LAYER_1, NODE_COLOR_LAYER_2 } from '../../../common/colors';

import * as fetchCaseGraphActions from '../../reducer_actions/fetch_case_specific_graph';

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
  let color = NODE_COLOR_LAYER_1;
  if (layer === 2) {
    color = NODE_COLOR_LAYER_2;
  }

  return (
    <div style={{ margin: '15px 0px' }}>
      <Paper
        elevation={2}
        style={{ padding: '20px 15px' }}
        sx={{
          '&:hover': {
            background: color,
          },
        }}
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
      </Paper>
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
