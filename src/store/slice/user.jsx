import { createSlice } from "@reduxjs/toolkit";

export let userWalaSlice = createSlice({
  name: 'user-slice',
  initialState: {
    currentUser: null,
    isAuthenticated: false, 
  },
  reducers: {
    addUser: (state, action) => {
      // console.log("Logged in user:", action.payload);
      state.currentUser = action.payload;
      state.isAuthenticated = true; 
    },
    Logout: (state, action) => {
      localStorage.removeItem("token")
      state.currentUser = null;
      state.isAuthenticated = false; 
    },
  },
});

export let { addUser, Logout } = userWalaSlice.actions;
