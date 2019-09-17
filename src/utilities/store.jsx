import { applyMiddleware, createStore, compose } from 'redux';
import createReducer from '../redux/reducers';
import logger from 'redux-logger';

let middleware = []
if (process.env.NODE_ENV !== 'production') {
  middleware = [ ...middleware, logger ]
}

export const configureStore = () => {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(
    createReducer(),
    composeEnhancers(
      applyMiddleware(...middleware)
    )
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

export default configureStore;
