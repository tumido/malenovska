import { EVENT } from '../actionTypes';

const initialState = {
  eventId: undefined
};

export default (state = initialState, action) => {
  switch (action.type) {
    case EVENT.set: {
      return { ...state, eventId: action.eventId };
    }

    default:
      return state;
  }
};
