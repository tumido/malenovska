import { applyMiddleware, createStore, compose } from 'redux';
import createReducer from '../redux/reducers';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { getFirebase } from 'react-redux-firebase';

let middleware = [
  thunk.withExtraArgument(getFirebase)
];
if (process.env.NODE_ENV === 'development') {
  middleware = [ ...middleware, logger ];
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
