import React, { useState, Fragment } from 'react';

import { EuiSpacer, EuiTabbedContent } from '@elastic/eui';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { CycleTimeFilter } from './cycle_time_filter';
import Paper from '@mui/material/Paper';

const mapStateToProps = (state: any) => {
  return state;
};

const FilterTabs = (props) => {
  const tabs = [
    {
      id: 'variants',
      name: 'Variants',
      disabled: false,
      content: (
        <Fragment>
          <EuiSpacer />
          <Paper sx={{ width: '100%', height: '250px', overflow: 'hidden' }}>
            <p>Under Construction!</p>
          </Paper>
        </Fragment>
      ),
    },
    {
      id: 'cycletime',
      name: 'Cycle Time',
      disabled: false,
      content: (
        <Fragment>
          <CycleTimeFilter serverRequestData={props.serverRequestData} />
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
