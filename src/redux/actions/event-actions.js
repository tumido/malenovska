import { EVENT } from '../actionTypes';

export const setEvent = eventId => ({ type: EVENT.set, eventId });
