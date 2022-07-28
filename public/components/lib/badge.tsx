import { EuiBadge } from '@elastic/eui';
import { NODE_COLOR_LAYER_1, NODE_COLOR_LAYER_2 } from '../../../common/colors';
import React from 'react';
import * as badgeActions from '../../reducer_actions/badges';
import * as fetchCaseGraphActions from '../../reducer_actions/fetch_case_specific_graph';
import * as filterActions from '../../reducer_actions/get_cycle_times';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RootReducer } from '../../reducer/root_reducer';

export interface BadgeItem {
  filterAction: string;
  layer: number;
  badgeFunction: Function;
}

interface BadgeProps {
  filterAction: string;
  layer: number;
  removeBadge: Function;
  rootReducer: RootReducer;
  unselectCaseAction: Function;
  unselectCycleTimeAction: Function;
}
interface BadgeState {
  rootReducer: RootReducer;
}

const mapStateToProps = (state: BadgeState) => {
  return state;
};

const BadgeComponent = (props: BadgeProps) => {
  const color = props.layer === 1 ? NODE_COLOR_LAYER_1 : NODE_COLOR_LAYER_2;
  const { removeBadge } = props;
  const currentBadges = props.rootReducer.filter.badges;
  const action = props.filterAction;

  const badgeToRemove = {
    filterAction: action,
    layer: props.layer,
  };

  let badgeFunction: Function = () => {};
  if (action.includes('Filter Case')) {
    const { unselectCaseAction } = props;
    badgeFunction = unselectCaseAction;
  } else if (action.includes('Filter Cycle Time Group')) {
    const { unselectCycleTimeAction } = props;
    badgeFunction = unselectCycleTimeAction;
  }
  console.log(currentBadges);
  return (
    <div style={{ margin: '0px 5px' }}>
      <EuiBadge
        color={color}
        iconType="cross"
        iconSide="right"
        iconOnClick={() => {
          badgeFunction();
          removeBadge(currentBadges, badgeToRemove);
        }}
        iconOnClickAriaLabel="Remove Filter"
      >
        <div style={{ margin: '7pt' }}>{props.filterAction}</div>
      </EuiBadge>
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return bindActionCreators(
    {
      removeBadge: badgeActions.removeBadgeAction,
      unselectCycleTimeAction: filterActions.unselectCaseAction,
      unselectCaseAction: fetchCaseGraphActions.unselectCaseAction,
    },
    dispatch
  );
};

const connectedBadgeComponent = connect(mapStateToProps, mapDispatchToProps)(BadgeComponent);
export { connectedBadgeComponent as BadgeComponent };
