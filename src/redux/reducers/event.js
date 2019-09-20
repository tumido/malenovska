import { EVENT } from '../actionTypes';

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case EVENT.set: {
      return { ...state, ...(action.event) };
    }

    default:
      return state;
  }
};
