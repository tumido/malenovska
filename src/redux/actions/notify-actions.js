import { NOTIFY } from '../actionTypes';

export const openNotification = payload => (
  {
    type: NOTIFY.open,
    payload,
    id: payload.id || new Date().getTime() + Math.random()
  }
);

export const closeNotification = id => ({ type: NOTIFY.close, id });
export const removeNotification = id => ({ type: NOTIFY.remove, id });
