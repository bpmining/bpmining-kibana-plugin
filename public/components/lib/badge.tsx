import { EuiBadge } from '@elastic/eui';
import { COLOR_LAYER_1, COLOR_LAYER_2 } from '../../../common/colors';
import React from 'react';

export interface BadgeItem {
  filterAction: string;
  layer: number;
  badgeFunction: Function;
}

export function createBadge(filterAction: string, layer: number, badgeFunction: Function) {
  const color = layer === 1 ? COLOR_LAYER_1 : COLOR_LAYER_2;
  return (
    <div>
      <EuiBadge
        color={color}
        iconType="cross"
        iconSide="right"
        iconOnClick={() => {
          badgeFunction();
        }}
        iconOnClickAriaLabel="Remove Filter"
        data-test-sub="testExample4"
      >
        {filterAction}
      </EuiBadge>
    </div>
  );
}
