import React, { useEffect, useRef, useState } from 'react';
import { EuiPanel, EuiSpacer, EuiSwitch } from '@elastic/eui';
import logo from '../../../../common/logo/bpmining.svg';
import novatec_logo from '../../../../common/logo/NOVATEC-schwarz-violett-rot.png';
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
import { VisGraph } from 'plugins/bpmining-kibana-plugin/model/vis_types';

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

const useHasChanged = (val: any) => {
  const prevVal = usePrevious(val);
  return prevVal !== val;
};

const usePrevious = (value: any) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
const PanelComponent = (props: PanelComponentProps) => {
  const [checked, setChecked] = useState(false);
  const [graph, setGraph] = useState<VisGraph | undefined>(props.rootReducer.graph.graph);
  const hasGraphChanged = useHasChanged(props.rootReducer.graph.graph);

  useEffect(() => {
    const { getCycleTimeGroups } = props;
    getCycleTimeGroups(props.serverRequestData);
    if (hasGraphChanged) {
      setGraph(props.rootReducer.graph.graph);
    }
  }, [
    props.caseCount,
    props.caseIds,
    props.rootReducer.layer.selectedLayer,
    /*     props.rootReducer.case.selectedCase,
    props.rootReducer.filter.selectedCycleTimeCases, */
    props.rootReducer.graph.graph,
  ]);

  const onChange = (e: any) => {
    setChecked(e.target.checked);
  };

  const selectedCases = props.rootReducer.filter.selectedCycleTimeCases;
  const selectedCase = props.rootReducer.case.selectedCase;

  let isFilterSelected = false;
  let caseOverview = <div></div>;

  if (graph?.caseId) {
    if (selectedCases.length > 0 || selectedCase) {
      isFilterSelected = true;
      if (selectedCases.length === 1 || selectedCase) {
        const caseId = props.rootReducer.graph.graph?.caseId;
        const throughputTime = props.rootReducer.graph.graph?.throughputTime;

        const startTimestamp = props.rootReducer.graph.graph?.startTimestamp;
        const startDate = startTimestamp.split('|')[0];
        const startTime = startTimestamp.split('|')[1];

        const endTimestamp = props.rootReducer.graph.graph?.endTimestamp;
        const endDate = endTimestamp.split('|')[0];
        const endTime = endTimestamp.split('|')[1];

        caseOverview = (
          <div>
            <p>Case Details: {caseId}</p>
            <div>
              <EuiSpacer />
              <div className="date-container">
                <div>
                  <b>{startDate}</b>
                  <br></br>
                  {startTime}
                </div>
                <div>
                  <b>{endDate}</b>
                  <br></br>
                  {endTime}
                </div>
              </div>
              <EuiSpacer />
              {formatTime(throughputTime)}
            </div>
          </div>
        );
      }
    }
  }

  return (
    <EuiPanel paddingSize="m" style={{ minHeight: '680px' }}>
      <div className="design-scope">
        <img src={logo} alt="Logo" className="logo" />
        <EuiSpacer />
        <div className="counter-container">
          <CaseCounterComponent
            cases={props.caseCount}
            color={calculateColorValue(props.rootReducer.layer.selectedLayer)}
          />
          <VariantCounterComponent
            variants={1}
            color={calculateColorValue(props.rootReducer.layer.selectedLayer)}
          />
        </div>

        <div className="frequency-map-container">
          <p>Frequency Map</p>
          <EuiSwitch
            showLabel={false}
            label="Frequency Map"
            checked={checked}
            onChange={(e) => onChange(e)}
          />
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
