import React, { useState } from 'react';
import { EuiPanel, EuiSwitch } from '@elastic/eui';
import logo from '../../../../common/logo/bpmining.svg';
import './panel.scss';
import { CaseCounterComponent } from '../../lib/items/counter/case_counter';
import { VariantCounterComponent } from '../../lib/items/counter/variant_counter';
// import { CaseSelector } from './case_selector/case_selector';

export function PanelComponent() {
  const [checked, setChecked] = useState(false);
  const onChange = (e: any) => {
    setChecked(e.target.checked);
  };

  return (
    <EuiPanel paddingSize="m" style={{ minHeight: '100%' }}>
      <img src={logo} alt="Logo" className='logo' />

      <div className='counter-container'>
        <CaseCounterComponent cases={2} />
        <VariantCounterComponent variants={2} />
      </div>

      <div className='frequency-map-container'>
        <p>Frequency Map</p>
        <EuiSwitch
          showLabel={false}
          label='Frequency Map'
          checked={checked}
          onChange={(e) => onChange(e)}
        />
      </div>

  
    </EuiPanel>
  );
}
