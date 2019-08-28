import { createStore } from 'redux';
import createReducer from '../redux/reducers';

const initialState = {};

const configureStore = (initialState = {}) => {
  const store = createStore(
    createReducer(),
    initialState
  );

  store.injectedReducers = {};

  if (module.hot) {
    module.hot.accept('../redux/reducers', () => {
      store.replaceReducer(createReducer(store.injectedReducers));
      store.dispatch({ type: '@@REDUCER_INJECTED' });
    });
  }

  return store;
};

export const store = configureStore(initialState);
