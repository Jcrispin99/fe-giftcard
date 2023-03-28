import { combineReducers } from 'redux';
import user from './user';

const reducer = combineReducers({
  user
});

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    state = undefined;
  }  
  return reducer(state, action);
};

export default rootReducer;
