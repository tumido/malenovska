import { MAP_CENTER } from '../actionTypes';

const initialState = {
  center: undefined
};

export default (state = initialState, action) => {
  switch (action.type) {
    case MAP_CENTER.set: {
      return { ...state, center: action.center };
    }

    case MAP_CENTER.reset: {
      return { ...state, center: undefined };
    }

    default:
      return state;
  }
};
