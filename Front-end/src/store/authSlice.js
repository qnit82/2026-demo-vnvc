import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import util from '../web-configs/util.ts';

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${util.apiUrl}/auth/login`, credentials);
    // Lưu phần data (LoginResponse) vào localStorage
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
      return response.data.data;
    }
    return rejectWithValue(response.data);
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const user = JSON.parse(localStorage.getItem('user'));

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: user || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('user');
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
