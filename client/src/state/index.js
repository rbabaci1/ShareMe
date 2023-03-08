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
    addPostComment: (state, action) => {
      const { postId, comment } = action.payload;

      state.posts = state.posts.map(post => {
        if (post._id === postId) {
          post.comments.push(comment);
        }
        return post;
      });
    },
    savePost: (state, action) => {
      const { postId, save } = action.payload;

      state.posts = state.posts.map(post => {
        if (post._id === postId) {
          post.save.push(save);
        }
        return post;
      });
    },
  },
});

export const { setLogin, setLogout, setPosts, addPostComment, savePost } =
  authSlice.actions;

export default authSlice.reducer;
