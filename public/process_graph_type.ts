import { i18n } from '@kbn/i18n';

import {
  VIS_EVENT_TO_TRIGGER,
  VisGroups,
  VisTypeDefinition,
} from '../../../src/plugins/visualizations/public';

import { toExpressionAst } from './to_ast';
import { ProcessGraphVisParams } from './types';
import { ProcessGraphEditor } from './components/editor/process_graph_editor';

export const createProcessGraphTypeDefinition = (): VisTypeDefinition<ProcessGraphVisParams> => ({
  name: 'process_graph_vis',
  title: 'bpmining',
  icon: 'controlsHorizontal',
  group: VisGroups.PROMOTED,
  description: i18n.translate('process_graph.vis.processGraphDescription', {
    defaultMessage: 'Kibana Process Mining Tool.',
  }),
  visConfig: {
    defaults: {
      indexPatternId: 0,
    },
  },
  editorConfig: {
    optionTabs: [
      {
        name: 'options',
        title: 'Options',
        editor: ProcessGraphEditor,
      },
    ],
  },
  toExpressionAst,
  options: {
    showIndexSelection: true,
    showQueryBar: true,
    showFilterBar: true,
  },
  getSupportedTriggers: () => {
    return [VIS_EVENT_TO_TRIGGER.filter];
  },
  requiresSearch: true,
});
