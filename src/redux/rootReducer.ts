import { combineReducers } from 'redux';
import authReducer from './slices/auth';

const rootReducer = combineReducers({
  auth: authReducer,
});

export { rootReducer };
