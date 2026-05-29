import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';

const storedUser  = JSON.parse(localStorage.getItem('user')  || 'null');
const storedToken = localStorage.getItem('token') || null;

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post('/auth/login', credentials);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user',  JSON.stringify(data));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post('/auth/register', userData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user',  JSON.stringify(data));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const fetchProfile = createAsyncThunk('auth/profile', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get('/auth/me');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:    storedUser,
    token:   storedToken,
    loading: false,
    error:   null,
  },
  reducers: {
    logout(state) {
      state.user  = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending  = (state)         => { state.loading = true;  state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };
    const fulfilled = (state, action) => {
      state.loading = false;
      state.user    = action.payload;
      state.token   = action.payload.token || state.token;
    };

    builder
      .addCase(loginUser.pending,    pending)
      .addCase(loginUser.fulfilled,  fulfilled)
      .addCase(loginUser.rejected,   rejected)
      .addCase(registerUser.pending,    pending)
      .addCase(registerUser.fulfilled,  fulfilled)
      .addCase(registerUser.rejected,   rejected)
      .addCase(fetchProfile.pending,    pending)
      .addCase(fetchProfile.fulfilled,  fulfilled)
      .addCase(fetchProfile.rejected,   rejected);
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
