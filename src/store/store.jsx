
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { userWalaSlice } from "./slice/user"; 
import { movieSlice } from "./slice/moviesFavourite";


let rootReducer=combineReducers({
  user: userWalaSlice.reducer, 
  movieSlice:movieSlice.reducer
});

export let merastore = configureStore({
    reducer: rootReducer
});
