import {SET_EVENT} from './constants'

const initialState = {
  name: '',
  year: 2018,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_EVENT:
      return {
        ...state,
        name: action.event.replace("/", ""),
        year: action.year
      }
    default:
      return state
  }
}

export default reducer
