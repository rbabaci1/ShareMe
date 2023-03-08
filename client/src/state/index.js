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
          if (!post?.comments) post.comments = [];
          post.comments.push(comment);
        }
        return post;
      });
    },
    createPost: (state, action) => {
      state.posts.push(action.payload);
    },
    addSavePost: (state, action) => {
      const { postId, save } = action.payload;

      state.posts = state.posts.map(post => {
        if (post._id === postId) {
          if (!post?.save) post.save = [];
          post.save.push(save);
        }
        return post;
      });
    },
    removePost: (state, action) => {
      const { postId } = action.payload;

      state.posts = state.posts.filter(post => post._id !== postId);
    },
  },
});

export const {
  setLogin,
  setLogout,
  setPosts,
  createPost,
  addPostComment,
  addSavePost,
  removePost,
} = authSlice.actions;

export default authSlice.reducer;
