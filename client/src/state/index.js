import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  posts: [],
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
    },
    setLogout: state => {
      state.user = null;
      state.posts = [];
    },
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
  },
});

export const { setLogin, setLogout, setPosts } = authSlice.actions;

export default authSlice.reducer;
