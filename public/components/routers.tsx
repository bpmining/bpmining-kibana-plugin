import { VisGraphProps } from 'plugins/bpmining-kibana-plugin/model/vis_types';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { calculateColorValue } from '../services';
import { CaseCounterComponent } from './lib/counter/case_counter';
import { VariantCounterComponent } from './lib/counter/variant_counter';
import { VisGraphComponent } from './pages/process_graph/vis_graph';

export function GraphRouter({ nodes, edges }: VisGraphProps) {
  return (
    <Switch>
      <Route exact path="/">
        <VisGraphComponent nodes={nodes} edges={edges} color={calculateColorValue(1)} />
      </Route>
      <Route path="/layer2">
        <VisGraphComponent nodes={nodes} edges={edges} color={calculateColorValue(2)} />
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
        <CaseCounterComponent cases={cases} color={calculateColorValue(1)} />
      </Route>
      <Route path="/layer2">
        <CaseCounterComponent cases={cases} color={calculateColorValue(2)} />
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
        <VariantCounterComponent variants={variants} color={calculateColorValue(1)} />
      </Route>
      <Route path="/layer2">
        <VariantCounterComponent variants={variants} color={calculateColorValue(2)} />
      </Route>
    </Switch>
  );
}
