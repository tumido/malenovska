import * as constants from './actionTypes';

export const setEvent = eventId => ({ type: constants.EVENT_CONTEXT_ID.set, eventId });

export const setCenter = center => ({ type: constants.MAP_CENTER.set, center });
export const resetCenter = () => ({ type: constants.MAP_CENTER.reset });
