import { applyMiddleware, createStore } from 'redux';
import createReducer from '../redux/reducers';
import logger from 'redux-logger';

const configureStore = () => {
  const store = createStore(
    createReducer(),
    applyMiddleware(logger)
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

export const store = configureStore();
