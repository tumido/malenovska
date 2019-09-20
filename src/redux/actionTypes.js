export const EVENT = {
  set: '@@event/CONTEXT_SET'
};

export const MAP = {
  set: '@@map/CENTER_SET',
  reset: '@@map/CENTER_RESET'
};

export const PARTICIPANT = {
  add: {
    pending: '@@participant/ADD_PENDING',
    success: '@@participant/ADD_SUCCESS',
    failed: '@@participant/ADD_FAILED'
  }
};
