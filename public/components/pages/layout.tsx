import React, { useEffect, useState } from 'react';
import { EuiPage, EuiResizableContainer } from '@elastic/eui';
import { PanelComponent } from './side_panel/panel';
import { LayerPanelComponent } from './layer_panel/layer_panel';
import { GraphRouter } from '../routers';
import '../_base.scss';
import { VisEdge, VisNode } from 'plugins/bpmining-kibana-plugin/model/vis_types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { constNull } from 'fp-ts/lib/function';

type Props = {
  nodes: VisNode[];
  edges: VisEdge[];
  metadata: any;
};

const mapStateToProps = (state) => {
  console.log(state);
  return state;
};

const LayoutComponent = (props) => {
  const [caseCount, setCaseCount] = useState(0);
  const [caseIds, setCaseIds] = useState([]);
  console.log(props.metadata.data);
  useEffect(() => {
    console.log(props.metadata.data);
    setCaseCount(props.metadata.data.caseCount);
    setCaseIds(props.metadata.data.caseIds);
  }, [props]);

  let graphBool = false;
  if (props.rootReducer.graph) {
    graphBool = true;
  }

  return (
    <EuiPage paddingSize="none">
      <EuiResizableContainer style={{ height: 650, width: '100%' }}>
        {(EuiResizablePanel, EuiResizableButton) => (
          <>
            <EuiResizablePanel mode="collapsible" initialSize={20} minSize="18%">
              <PanelComponent caseCount={caseCount} caseIds={caseIds} metadata={props.metadata} />
            </EuiResizablePanel>

            <EuiResizableButton />

            <EuiResizablePanel mode="main" initialSize={80} minSize="500px">
              <div className="design-scope">
                {graphBool && (
                  <GraphRouter
                    nodes={props.rootReducer.graph.nodes}
                    edges={props.rootReducer.graph.edges}
                  />
                )}
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
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};

const connectedLayoutComponent = connect(mapStateToProps, mapDispatchToProps)(LayoutComponent);
export { connectedLayoutComponent as LayoutComponent };
