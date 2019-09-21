import { STORAGE } from '../actionTypes';

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case STORAGE.pending:
    case STORAGE.pendingUrl: {
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          status: action.type.split('/').slice(-1)[0]
        }
      };
    }

    case STORAGE.failed:
    case STORAGE.success: {
      return {
        ...state,
        [action.id]: {
          status: action.type.split('/').slice(-1)[0],
          href: action.href
        }
      };
    }

    default:
      return state;
  }
};
