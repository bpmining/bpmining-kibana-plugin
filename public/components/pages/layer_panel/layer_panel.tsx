import React from 'react';
import './layers.scss';
import { EuiPanel } from '@elastic/eui';
import { useHistory } from 'react-router-dom';

export function LayerPanelComponent() {
    let history = useHistory();

    const handleRouting = (route: string) => {
      history.push(route);
    };
  return (
    <EuiPanel className="layer-panel" paddingSize="s">
                  <p>
                    <b>Layers</b>
                  </p>
                  <br></br>
                  <div className="layer-stack">
                    <div className="layer-1" onClick={() => handleRouting('/')}></div>
                    <div className="layer-2" onClick={() => handleRouting('/layer2')}></div>
                  </div>
    </EuiPanel>
  );
}
