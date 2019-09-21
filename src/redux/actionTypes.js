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

export const STORAGE = {
  pendingUrl: '@@storage/FILE_URL_PENDING',
  pending: '@@storage/FILE_PENDING',
  success: '@@storage/FILE_SUCCESS',
  failed: '@@storage/FILE_FAILED'
};
