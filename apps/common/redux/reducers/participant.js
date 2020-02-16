import { PARTICIPANT } from '../actionTypes';

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case PARTICIPANT.add.pending:
    case PARTICIPANT.add.success:
    case PARTICIPANT.add.failed: {
      return { ...state, payload: action.payload };
    }

    default:
      return state;
  }
};
