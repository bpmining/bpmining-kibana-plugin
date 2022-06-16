import React, { useState } from 'react';
import { EuiPanel, EuiSwitch } from '@elastic/eui';
import logo from '../../../../common/logo/bpmining.svg';
import '../../_base.scss';
import './panel.scss';
import { CaseCounterRouter, VariantCounterRouter } from '../../routers';
import { CaseSelector } from './case_selector/case_selector';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

interface PanelComponentProps {
  caseIds: string[];
  caseCount: number;
}

const mapStateToProps = (state) => {
  return state;
};

const PanelComponent = (props) => {
  const [checked, setChecked] = useState(false);
  const onChange = (e: any) => {
    setChecked(e.target.checked);
  };
  console.log(props);
  return (
    <EuiPanel paddingSize="m" style={{ minHeight: '100%' }}>
      <div className="design-scope">
        <img src={logo} alt="Logo" className="logo" />

        <div className="counter-container">
          <CaseCounterRouter cases={props.caseCount} />
          <VariantCounterRouter variants={2} />
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
        <CaseSelector caseIds={props.caseIds} metadata={props.metadata} />
      </div>
    </EuiPanel>
  );
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};

const connectedPanelComponent = connect(mapStateToProps, mapDispatchToProps)(PanelComponent);
export { connectedPanelComponent as PanelComponent };
