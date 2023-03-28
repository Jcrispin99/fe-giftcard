import { types } from '../types';
import { loadedState } from '../state';

const initialState = { ...loadedState.user };

function user(state = initialState, action) {
  switch (action.type) {
    case types.USER_REMOVE: {
      return null;
    }
    case types.USER_UPDATE:
    case types.USER_ADD: {
      return { ...state, ...action.payload };
    }
    default:
      return state;
  }
}

export default user;
