import React, { useEffect } from 'react';
import { ProcessGraphVisParams } from '../types';
import { LayoutComponent } from './pages/layout';
import { ResponseData } from '../reducer_actions/fetch_aggregated_graph';

export interface RawResponseData {
  data: ResponseData;
  index: any;
  filter: any;
  timeFieldName: string;
  timeRangeFrom: any;
  timeRangeTo: any;
}

interface ProcessGraphComponentProps {
  renderComplete(): void;
  visParams: ProcessGraphVisParams;
  visData: RawResponseData;
}

export function BpminingApp(props: ProcessGraphComponentProps) {
  useEffect(() => {
    props.renderComplete();
  });
  return <LayoutComponent metadata={props.visData} />;
}
