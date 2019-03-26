import {SET_EVENT} from './constants'

export const setEvent = (event, year) => (
  {
    type: SET_EVENT,
    event: event,
    year: year
  }
)
