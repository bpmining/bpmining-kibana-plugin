import React, { useEffect, useState } from 'react';
import { EuiPanel, EuiSpacer } from '@elastic/eui';
import { FormControlLabel, Switch, SwitchProps } from '@mui/material';
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import logo from '../../../../common/logo/bpmining.svg';
import novatec_logo from '../../../../common/logo/NOVATEC-schwarz-violett-rot.png';
import startDateIcon from '../../../../common/icons/start_date.png';
import endDateIcon from '../../../../common/icons/end_date.png';
import '../../_base.scss';
import './panel.scss';
import { CaseSelector } from './case_selector/case_selector';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RootReducer } from '../../../reducer/root_reducer';
import { calculateColorValue } from '../../../services';
import { CaseCounterComponent } from '../../lib/counter/case_counter';
import { VariantCounterComponent } from '../../lib/counter/variant_counter';
import { ServerRequestData } from '../../app';
import { FilterTabs } from './filter_tabs/tabs';
import * as filterActions from '../../../reducer_actions/get_cycle_times';
import { formatTime } from '../../../../server/graph_calculation/calculate_throughput_time';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import _ from 'lodash';
import { CycleTimeItem } from '../../../reducer_actions/get_cycle_times';
import { CaseGroupComponent } from '../../lib/case_group_item';

interface PanelComponentState {
  rootReducer: RootReducer;
}

interface PanelComponentProps {
  caseIds: string[];
  caseCount: number;
  serverRequestData: ServerRequestData;
  rootReducer: RootReducer;
  getCycleTimeGroups: Function;
}

const mapStateToProps = (state: PanelComponentState) => {
  return state;
};

const PanelComponent = (props: PanelComponentProps) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const { getCycleTimeGroups } = props;
    getCycleTimeGroups(props.serverRequestData);
  }, [
    props.caseCount,
    props.caseIds,
    props.rootReducer.layer.selectedLayer,
    props.rootReducer.graph.graph,
  ]);

  const onChange = (e: any) => {
    setChecked(e.target.checked);
  };

  const selectedCycleTimeCases = props.rootReducer.filter.selectedCycleTimeCases;
  const selectedCase = props.rootReducer.case.selectedCase;
  const color = calculateColorValue(props.rootReducer.layer.selectedLayer);
  const graph = props.rootReducer.graph.drillDownGraph
    ? props.rootReducer.graph.drillDownGraph
    : props.rootReducer.graph.graph;
  let isFilterSelected = false;
  let caseOverview = <div></div>;

  if (graph?.caseId) {
    if (selectedCase) {
      isFilterSelected = true;
      const caseId = graph?.caseId;
      const throughputTime = graph?.throughputTime;

      const startTimestamp = graph?.startTimestamp;
      const startDate = startTimestamp?.split('|')[0];
      const startTime = startTimestamp?.split('|')[1];

      const endTimestamp = graph?.endTimestamp;
      const endDate = endTimestamp?.split('|')[0];
      const endTime = endTimestamp?.split('|')[1];

      const contextInfo: any = [];
      graph?.nodes.map((node) => {
        const context = node.contextInfo;
        if (context !== undefined) {
          Object.keys(context).map((key) => {
            const item = { [key]: context[key] };
            if (!contextInfo.find((i: any) => _.isEqual(i, item))) {
              contextInfo.push(item);
            }
          });
        }
      });

      caseOverview = (
        <div>
          <EuiSpacer />
          <p>Case Details: {caseId}</p>
          <div>
            <EuiSpacer />
            <div className="date-container">
              <div className="date-container">
                <img src={startDateIcon} alt="Start Date" className="start-date" />
                <div>
                  <b>{startDate}</b>
                  <br></br>
                  {startTime}
                </div>
              </div>

              <div className="date-container">
                <img src={endDateIcon} alt="End Date" className="end-date" />
                <div>
                  <b>{endDate}</b>
                  <br></br>
                  {endTime}
                </div>
              </div>
            </div>
            <EuiSpacer />
            <div className="time-container">
              <AccessTimeIcon
                style={{ width: '23px', height: '23px', margin: '0px 10px 0px 0px' }}
              />{' '}
              {throughputTime && formatTime(throughputTime)}
            </div>
            <EuiSpacer />
            <EuiSpacer />
            <div>
              {contextInfo.length > 0 && <p>Context Informations</p>}
              <br />
              {contextInfo.length > 0 &&
                contextInfo.map((item: any) => {
                  const entries = Object.entries(item);
                  return (
                    <div className="node-panel-item">
                      <b>{entries[0][0]}:</b> {entries[0][1]}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      );
    }
  }

  if (selectedCycleTimeCases.id) {
    if (!selectedCase) {
      isFilterSelected = true;
      const cycleTimeCases = selectedCycleTimeCases.cases;

      caseOverview = (
        <div>
          <p>Cycle Time Group {selectedCycleTimeCases.id}</p>
          Cycle Time: {selectedCycleTimeCases.interval}
          {cycleTimeCases.map((cycleTimeCase: CycleTimeItem) => {
            return (
              <CaseGroupComponent
                caseId={cycleTimeCase.caseId}
                cycleTime={formatTime(cycleTimeCase.cycleTimeInSeconds)}
                serverRequestData={props.serverRequestData}
              />
            );
          })}
        </div>
      );
    }
  }

  const IOSSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: theme.palette.mode === 'dark' ? color : color,
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600],
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 22,
      height: 22,
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },
  }));

  return (
    <EuiPanel paddingSize="m" style={{ minHeight: '740px' }}>
      <div className="design-scope">
        <img src={logo} alt="Logo" className="logo" />
        <EuiSpacer />
        <div className="counter-container">
          <div className="counter-item">
            <CaseCounterComponent cases={props.caseCount} color={color} />
          </div>
          <div className="counter-item">
            <VariantCounterComponent variants={1} color={color} />
          </div>
        </div>

        <div className="frequency-map-container">
          <p>Frequency Map</p>
          <FormControlLabel control={<IOSSwitch sx={{ m: 1 }} />} label="" />
        </div>
        <EuiSpacer />
        {isFilterSelected ? (
          <div>{caseOverview}</div>
        ) : (
          <div>
            <CaseSelector caseIds={props.caseIds} />
            <EuiSpacer />
            <FilterTabs serverRequestData={props.serverRequestData} />
          </div>
        )}
        <EuiSpacer />
        <img src={novatec_logo} alt="Novatec Logo" className="novatec-logo" />
      </div>
    </EuiPanel>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return bindActionCreators(
    {
      getCycleTimeGroups: filterActions.getCycleTimeData,
    },
    dispatch
  );
};

const connectedPanelComponent = connect(mapStateToProps, mapDispatchToProps)(PanelComponent);
export { connectedPanelComponent as PanelComponent };
