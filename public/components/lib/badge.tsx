import { EuiBadge } from '@elastic/eui';
import { NODE_COLOR_LAYER_1, NODE_COLOR_LAYER_2 } from '../../../common/colors';
import React from 'react';
import * as badgeActions from '../../reducer_actions/badges';
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
  badgeFunction: Function;
  removeBadge: Function;
  rootReducer: RootReducer;
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
  const badgeToRemove = {
    filterAction: props.filterAction,
    layer: props.layer,
    badgeFunction: props.badgeFunction,
  };

  /* let badgeFunction = props.badgeFunction;
  badgeFunction = badgeFunction.substring(badgeFunction.indexOf("{") + 1);
  badgeFunction = badgeFunction.substring(0, badgeFunction.indexOf("}"));   
  console.log(badgeFunction)
  const deserializedBadgeFunction = Function(badgeFunction);
  console.log(deserializedBadgeFunction) */
  return (
    <div style={{ margin: '0px 5px' }}>
      <EuiBadge
        color={color}
        iconType="cross"
        iconSide="right"
        iconOnClick={() => {
          props.badgeFunction();
          removeBadge(currentBadges, badgeToRemove);
        }}
        iconOnClickAriaLabel="Remove Filter"
        data-test-sub="testExample4"
      >
        {props.filterAction}
      </EuiBadge>
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return bindActionCreators(
    {
      removeBadge: badgeActions.removeBadgeAction,
    },
    dispatch
  );
};

const connectedBadgeComponent = connect(mapStateToProps, mapDispatchToProps)(BadgeComponent);
export { connectedBadgeComponent as BadgeComponent };
