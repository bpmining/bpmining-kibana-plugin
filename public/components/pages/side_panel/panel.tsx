import React from 'react';
import { EuiListGroup, EuiListGroupItem, EuiPanel } from '@elastic/eui';
import logo from '../../../../common/logo/bpmining.svg'
import './panel.scss'

export function PanelComponent() {
  return (
    <EuiPanel paddingSize="s" style={{ minHeight: '100%' }}>
      <img src={logo} alt="Logo"/>
      <b><p id='roboto'>Roboto</p></b>
    </EuiPanel>
  );
}
