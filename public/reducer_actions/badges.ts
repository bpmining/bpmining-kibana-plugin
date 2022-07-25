import { BadgeItem } from '../components/lib/badge';

export const ADD_BADGE = 'ADD_BADGE';
export const REMOVE_BADGE = 'REMOVE_BADGE';

export function addBadgeAction(badges: BadgeItem[], newBadge: BadgeItem) {
  const badgeToAdd = [newBadge];
  const newBadges = JSON.parse(JSON.stringify(badges)).concat(badgeToAdd);
  return {
    type: ADD_BADGE,
    newBadges: newBadges,
  };
}

export function removeBadgeAction(badges: BadgeItem[], badge: BadgeItem) {
  const updatedBadges = [...badges];
  const index = updatedBadges.findIndex((object) => {
    return object.filterAction === badge.filterAction;
  });

  if (index > -1) {
    updatedBadges.splice(index, 1);
  }

  return {
    type: REMOVE_BADGE,
    updatedBadges: updatedBadges,
  };
}
