import { SNACKBAR } from '../actionTypes';

const initialState = {};

export const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SNACKBAR.open:
      return { [action.payload.key]: action.payload.props, ...state };

    case SNACKBAR.close: {
      const { [action.payload.key]: omit, ...newState } = state;
      return newState;
    }

    default:
      return state;
  }
};
