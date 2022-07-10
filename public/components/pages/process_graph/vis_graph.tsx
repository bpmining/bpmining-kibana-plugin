// @ts-ignore
import Graph from 'react-graph-vis';
import React, { useEffect, useState } from 'react';
import { VisEdge, VisNode } from '../../../../model/vis_types';
import { NodeModal } from './node_modal';

export interface VisGraphComponentProps {
  nodes: VisNode[];
  edges: VisEdge[];
  color: string;
}

export function VisGraphComponent(props: VisGraphComponentProps) {
  const [nodeModal, setNodeModal] = useState(false);
  const [currentNode, setCurrentNode] = useState<VisNode>();
  useEffect(() => {}, [props]);
  const graph = {
    nodes: props.nodes,
    edges: props.edges,
  };

  const options = {
    autoResize: true,
    layout: {
      hierarchical: {
        enabled: true,
        nodeSpacing: 300,
        blockShifting: true,
        edgeMinimization: false,
        parentCentralization: true,
        sortMethod: 'directed',
      },
    },
    nodes: {
      shape: 'custom',
      ctxRenderer: ({ ctx, id, x, y, state: { selected, hover }, style, label }) => {
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

            const w = textLen.width * 3;
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
      color: '#000000',
      arrowStrikethrough: false,
    },
    height: '980px',
    physics: {
      enabled: false,
    },
  };

  const events = {
    async selectNode(event: { nodes: any }) {
      const { nodes } = event;
      const selectedNode = graph.nodes[nodes[0] - 1];
      console.log(selectedNode);
      await setCurrentNode(selectedNode);
      await setNodeModal(true);
    },
  };

  // return <Graph graph={graph} options={options} events={events} />;
  return (
    <div>
      <Graph graph={graph} options={options} events={events} />;
      {nodeModal ? <NodeModal node={currentNode}></NodeModal> : undefined}
    </div>
  );
}
