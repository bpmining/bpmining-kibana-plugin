import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { VisNode, VisEdge } from '../types';
import { CaseCounterComponent } from './lib/counter/case_counter';
import { VariantCounterComponent } from './lib/counter/variant_counter';
import { VisGraphComponent } from './pages/process_graph/vis_graph';

const COLOR_LAYER_1 = '#5B4897';
const COLOR_LAYER_2 = '#F39000';

interface VisGraphRouterProps {
  nodes: VisNode[];
  edges: VisEdge[];
}

export function GraphRouter({ nodes, edges }: VisGraphRouterProps) {
  return (
    <Switch>
      <Route exact path="/">
        <VisGraphComponent nodes={nodes} edges={edges} color={COLOR_LAYER_1} />
      </Route>
      <Route path="/layer2">
        <VisGraphComponent nodes={nodes} edges={edges} color={COLOR_LAYER_2} />
      </Route>
    </Switch>
  );
}

interface CaseCounterRouterProps {
  cases: number;
}

export function CaseCounterRouter({ cases }: CaseCounterRouterProps) {
  return (
    <Switch>
      <Route exact path="/">
        <CaseCounterComponent cases={cases} color={COLOR_LAYER_1} />
      </Route>
      <Route path="/layer2">
        <CaseCounterComponent cases={cases} color={COLOR_LAYER_2} />
      </Route>
    </Switch>
  );
}

interface VariantCounterRouterProps {
  variants: number;
}

export function VariantCounterRouter({ variants }: VariantCounterRouterProps) {
  return (
    <Switch>
      <Route exact path="/">
        <VariantCounterComponent variants={variants} color={COLOR_LAYER_1} />
      </Route>
      <Route path="/layer2">
        <VariantCounterComponent variants={variants} color={COLOR_LAYER_2} />
      </Route>
    </Switch>
  );
}
