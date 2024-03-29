// @ts-ignore
import Graph from 'react-graph-vis';
import React, { useState } from 'react';
import { VisEdge, VisNode } from '../../../../model/vis_types';
import { NodePanel } from './node_panel';
import { RootReducer } from 'plugins/bpmining-kibana-plugin/public/reducer/root_reducer';
import * as nodeDetailPanelActions from '../../../reducer_actions/node_detail_panel';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

export interface VisGraphComponentProps {
  nodes: VisNode[];
  edges: VisEdge[];
  rootReducer: RootReducer;
  showNodeDetailPanel: Function;
  hideNodeDetailPanel: Function;
}

interface VisGraphComponentState {
  rootReducer: RootReducer;
}

const mapStateToProps = (state: VisGraphComponentState) => {
  return state;
};

const VisGraphComponent = (props: VisGraphComponentProps) => {
  const [currentNode, setCurrentNode] = useState<VisNode>(props.nodes[0]);
  const [x, setXPosition] = useState<number>(0);
  const [y, setYPosition] = useState<number>(0);

  const graph = {
    nodes: props.nodes,
    edges: props.edges,
  };

  const aggregated =
    !props.rootReducer.case.selectedCase &&
    props.rootReducer.filter.selectedCycleTimeCases.length !== 1;

  const options = {
    autoResize: true,
    nodes: {
      shape: 'custom',
      ctxRenderer: ({ ctx, id, x, y, state: { selected, hover }, style, label }: any) => {
        let r = 35;
        const drawNode = async () => {
          if (label === undefined) {
            ctx.beginPath();
            ctx.arc(x, y, r - 10, 0, 2 * Math.PI, false);
            ctx.fillStyle = style.color;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = style.borderColor;
            ctx.stroke();
          } else {
            const splitLabel = label.split('|');
            const title = splitLabel[0];
            const frequencyAndCycleTime = splitLabel[1];
            const thirdPartyData = splitLabel.includes('third-party-data') ? true : false;
            const textLen = ctx.measureText(title);

            const w = textLen.width + 250;
            const h = 2 * r;
            if (w < 2 * r) {
              r = w / 2;
            }
            if (h < 2 * r) {
              r = h / 2;
            }

            // draw rounded nodes
            ctx.beginPath();
            ctx.moveTo(x, y - r);
            ctx.arcTo(x - r + w, y - r, x - r + w, y - r + h, r);
            ctx.arcTo(x - r + w, y - r + h, x - r, y - r + h, r);
            ctx.arcTo(x - r, y - r + h, x - r, y - r, r);
            ctx.arcTo(x - r, y - r, x - r + w, y - r, r);
            ctx.closePath();
            ctx.save();
            // if slowest node fill red
            if (style.color === '#F9D0D2') {
              ctx.fillStyle = style.color;
            } else {
              ctx.fillStyle = 'white';
            }
            ctx.fill();
            ctx.stroke();

            // draw circles with icons
            ctx.beginPath();
            ctx.arc(x, y, r - 10, 0, 2 * Math.PI, false);
            if (style.color === '#F9D0D2') {
              ctx.fillStyle = '#E9454E';
            } else {
              ctx.fillStyle = style.color;
            }

            ctx.fill();

            // add labels
            ctx.font = 'bold 18px sans-serif';
            ctx.fillStyle = 'black';
            ctx.fillText(title, x - r + 75, y - 8);

            ctx.font = 'normal 18px sans-serif';
            ctx.fillStyle = 'black';
            ctx.fillText(frequencyAndCycleTime, x - r + 75, y + 18);

            // add drill down icon
            if (thirdPartyData) {
              // TODO:
              const material_font = new FontFace(
                'material-icons',
                'url(https://fonts.gstatic.com/s/materialicons/v48/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2)'
              );
              document.fonts.add(material_font);
              await material_font
                .load()
                .then(() => {
                  ctx.fillStyle = 'black';
                  ctx.font = '30px material-icons';
                  ctx.fillText('layers', x - r + w - 50, y);
                })
                .catch(console.error);
            }
            ctx.restore();
          }
        };
        return {
          drawNode,
          nodeDimensions: { width: 2 * r, height: 2 * r },
        };
      },
    },
    edges: {
      color: {
        color: '828282',
        inherit: false,
      },
      arrowStrikethrough: false,
    },
    height: '1080px',
    physics: {
      enabled: false,
    },
  };

  const events = {
    selectNode(clickEvent: { nodes: any; pointer: any; event: any }) {
      const { nodes, pointer } = clickEvent;
      const selectedNode = graph.nodes.find((node) => node.id === nodes[0]);
      if (selectedNode && selectedNode.label !== '') {
        setCurrentNode(selectedNode);
        setXPosition(pointer.DOM.y - 100);
        setYPosition(pointer.DOM.x);
        const { showNodeDetailPanel } = props;
        showNodeDetailPanel();
      }
    },
    deselectNode() {
      const { hideNodeDetailPanel } = props;
      hideNodeDetailPanel();
    },
    zoom() {
      const { hideNodeDetailPanel } = props;
      hideNodeDetailPanel();
    },
  };

  return (
    <div>
      <Graph graph={graph} options={options} events={events} />

      {props.rootReducer.graph.nodeDetail && (
        <div
          className="node-panel-container"
          style={{ position: 'absolute', top: x + 'px', right: y + 'px' }}
        >
          <NodePanel node={currentNode} aggregated={aggregated}></NodePanel>
        </div>
      )}
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return bindActionCreators(
    {
      showNodeDetailPanel: nodeDetailPanelActions.showNodeDetailPanelAction,
      hideNodeDetailPanel: nodeDetailPanelActions.hideNodeDetailPanelAction,
    },
    dispatch
  );
};

const connectedVisGraph = connect(mapStateToProps, mapDispatchToProps)(VisGraphComponent);
export { connectedVisGraph as VisGraphComponent };
