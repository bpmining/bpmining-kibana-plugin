import React from 'react';
import { EuiPage, EuiResizableContainer } from '@elastic/eui';
import { PanelComponent } from './side_panel/panel';
import { VisNode, VisEdge } from '../../types';
import { LayerPanelComponent } from './layer_panel/layer_panel';
import { GraphRouter } from '../routers';
import '../_base.scss';

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
              <EuiResizablePanel mode="collapsible" initialSize={20} minSize="18%">
                <PanelComponent />
              </EuiResizablePanel>

              <EuiResizableButton />

              <EuiResizablePanel mode="main" initialSize={80} minSize="500px">
                <div className='design-scope'>
                  <GraphRouter nodes={nodes} edges={edges} />
                  <div className="layer-container">
                    <LayerPanelComponent />
                  </div>
                </div>
              </EuiResizablePanel>
            </>
          )}
        </EuiResizableContainer>
    </EuiPage>
  );
}
