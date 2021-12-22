import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';
import axios from '../../utils/axios';
import { AuthRequestData, AuthState } from '../../@types/auth';

const initialState: AuthState = {
  isLoading: false,
  error: false,
  user: null,
  isAuthenticated: false,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    authSuccess(state, action) {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    }
  },
});

export default slice.reducer;

export async function getUser(publicAddress: string) {
  dispatch(slice.actions.startLoading());

  try {
    const response = await axios.get('/api/user', {
      params: { publicAddress },
    });

    return response.data;
  } catch (e) {
    dispatch(slice.actions.hasError(e));
  }
}

export function authenticate(data: AuthRequestData) {
  return async () => {
    dispatch(slice.actions.startLoading());

    try {
      const response = await axios.post('/api/user/auth', data);

      dispatch(slice.actions.authSuccess(response.data));
    } catch (e) {
      dispatch(slice.actions.hasError(e));
    }
  };
}
