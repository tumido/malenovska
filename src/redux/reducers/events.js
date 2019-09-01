import { SET_EVENT_CONTEXT_ID } from '../actionTypes';

const initialState = {
  eventId: undefined
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_EVENT_CONTEXT_ID: {
      return { ...state, eventId: action.eventId };
    }

    default:
      return state;
  }
};
