import { MAP } from '../actionTypes';

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case MAP.set: {
      return { ...state, center: action.center };
    }

    case MAP.reset: {
      return { ...state, center: undefined };
    }

    default:
      return state;
  }
};
