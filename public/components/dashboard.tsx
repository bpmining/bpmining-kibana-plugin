import React from 'react';
import './layers.scss';
import { VisGraphComponent } from './vis_graph_component';
import { EuiPage, EuiPanel, EuiResizableContainer } from '@elastic/eui';
import { Route, Switch, useHistory } from 'react-router-dom';
import { PanelComponent } from './menu/panel';
import { VisNode, VisEdge } from './app';

type Props = {
  nodes: VisNode[];
  edges: VisEdge[];
};

export function DashboardComponent({ nodes, edges }: Props) {
  let history = useHistory();

  const handleRouting = (route: string) => {
    history.push(route);
  };
  return (
    <EuiPage paddingSize="none">
      <EuiResizableContainer style={{ height: 650, width: '100%' }}>
        {(EuiResizablePanel, EuiResizableButton) => (
          <>
            <EuiResizablePanel mode="collapsible" initialSize={20} minSize="10%">
              <PanelComponent />
            </EuiResizablePanel>

            <EuiResizableButton />

            <EuiResizablePanel mode="main" initialSize={80} minSize="500px">
              <Switch>
                <Route exact path="/">
                  <VisGraphComponent nodes={nodes} edges={edges} color={'#5B4897'} />
                </Route>
                <Route path="/layer2">
                  <VisGraphComponent nodes={nodes} edges={edges} color={'#F39000'} />
                </Route>
              </Switch>

              <div className="layer-container">
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
              </div>
            </EuiResizablePanel>
          </>
        )}
      </EuiResizableContainer>
    </EuiPage>
  );
}
