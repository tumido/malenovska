import { PARTICIPANT } from '../actionTypes';

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case PARTICIPANT.add.set: {
      return { ...state, payload: action.payload };
    }

    default:
      return state;
  }
};
