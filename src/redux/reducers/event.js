import { EVENT_CONTEXT_ID } from '../actionTypes';

const initialState = {
  eventId: undefined
};

export default (state = initialState, action) => {
  switch (action.type) {
    case EVENT_CONTEXT_ID.set: {
      return { ...state, eventId: action.eventId };
    }

    default:
      return state;
  }
};
