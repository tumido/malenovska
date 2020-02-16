import { MAP } from '../actionTypes';

export const setCenter = center => ({ type: MAP.set, center });
export const resetCenter = () => ({ type: MAP.reset });
