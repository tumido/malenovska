import { NOTIFY } from '../actionTypes';

const initialState = { open: [], close: []};

export const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case NOTIFY.open:
      return {
        ...state,
        open: [
          ...state.open.filter(n => n.id !== action.id),
          action.payload
        ]
      };

    case NOTIFY.close: {
      return {
        open: state.open.filter(n => n.id !== action.id),
        close: [
          ...state.close,
          ...state.open.filter(n => n.id === action.id)
        ]
      };
    }

    case NOTIFY.remove: {
      return {
        ...state,
        close: state.close.filter(n => n.id !== action.id)
      };
    }

    default:
      return state;
  }
};

export default reducer;
