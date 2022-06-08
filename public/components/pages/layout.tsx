import React from 'react';
import { VisGraphComponent } from './process_graph/vis_graph';
import { EuiPage, EuiResizableContainer } from '@elastic/eui';
import { Route, Switch, } from 'react-router-dom';
import { PanelComponent } from './side_panel/panel';
import { VisNode, VisEdge } from '../../types';
import { LayerPanelComponent } from './layer_panel/layer_panel';

type Props = {
  nodes: VisNode[];
  edges: VisEdge[];
};

export function LayoutComponent({ nodes, edges }: Props) {
  
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
                <LayerPanelComponent />
              </div>
            </EuiResizablePanel>
          </>
        )}
      </EuiResizableContainer>
    </EuiPage>
  );
}
