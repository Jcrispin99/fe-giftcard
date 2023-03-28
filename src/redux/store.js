import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './reducers/rootReducer';
import thunk from 'redux-thunk';

import { loadState, saveState } from './state-handler';
const initialState = loadState();
const middleware = [thunk];

const store = createStore(rootReducer, initialState, compose(applyMiddleware(...middleware)));

store.subscribe(() => {
  saveState(store.getState())
});

export default store;
