import React, { useEffect, useState } from 'react';
import { EuiPage, EuiResizableContainer } from '@elastic/eui';
import { PanelComponent } from './side_panel/panel';
import { LayerPanelComponent } from './layer_panel/layer_panel';
import { GraphRouter } from '../routers';
import '../_base.scss';
import { fetchProcessGraphCase } from '../../reducer_actions/fetch_case_specific_graph';
import { VisEdge, VisNode } from 'plugins/bpmining-kibana-plugin/model/vis_types';

type Props = {
  nodes: VisNode[];
  edges: VisEdge[];
  metadata: any;
};

export function LayoutComponent({ nodes, edges, metadata }: Props) {
  const [graph, setGraph] = useState({ nodes: nodes, edges: edges });

  useEffect(() => {
    const fetchData = async () => {
      const graph = await fetchProcessGraphCase(metadata, 'A-11');
      setGraph(graph);
      console.log(graph);
    };
    fetchData();
  }, []);

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
              <div className="design-scope">
                <GraphRouter nodes={graph.nodes} edges={graph.edges} />
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
