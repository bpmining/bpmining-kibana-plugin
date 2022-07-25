import React, { Fragment } from 'react';

import { EuiSpacer, EuiTabbedContent } from '@elastic/eui';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { CycleTimeFilter } from './cycle_time_filter';
import Paper from '@mui/material/Paper';
import { ServerRequestData } from 'plugins/bpmining-kibana-plugin/public/reducer_actions/fetch_case_specific_graph';

interface FilterTabProps {
  serverRequestData: ServerRequestData;
}

const mapStateToProps = (state: any) => {
  return state;
};

const FilterTabs = (props: FilterTabProps) => {
  const tabs = [
    {
      id: 'variants',
      name: 'Variants',
      disabled: false,
      content: (
        <Fragment>
          <EuiSpacer />
          <Paper sx={{ width: '100%', height: '250px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', textAlign: 'center', padding: '70px' }}>
              <p style={{ color: '#828282' }}>Under Construction!</p>
            </div>
          </Paper>
        </Fragment>
      ),
    },
    {
      id: 'cycletime',
      name: 'Cycle Time',
      color: '#5B4897',
      disabled: false,
      content: (
        <Fragment>
          <CycleTimeFilter />
        </Fragment>
      ),
    },
  ];

  return (
    <Fragment>
      <EuiTabbedContent
        tabs={tabs}
        initialSelectedTab={tabs[1]}
        autoFocus="selected"
        onTabClick={(tab) => {
          console.log('clicked tab', tab);
        }}
      />
    </Fragment>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return bindActionCreators({}, dispatch);
};

const connectedTabs = connect(mapStateToProps, mapDispatchToProps)(FilterTabs);
export { connectedTabs as FilterTabs };
