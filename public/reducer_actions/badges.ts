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
  const newBadges = JSON.parse(JSON.stringify(badges));
  const index = newBadges.indexOf(badge);
  if (index > -1) {
    newBadges.splice(index, 1);
  }
  return {
    type: REMOVE_BADGE,
    newBadges: newBadges,
  };
}
