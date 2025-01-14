import { createSlice } from "@reduxjs/toolkit";

export let movieSlice = createSlice({
  name: "movie-slices",
  initialState: {
    favouriteMovies: [],
  },
  reducers: {
    addToFavourites: (state, action) => {
      const movie = {
        movieId: action.payload.movieId || Math.random().toString(36).substring(7),
        title: action.payload.title || "Unknown Title",
        imageUrl: action.payload.imageUrl || "https://via.placeholder.com/150",
        rating: action.payload.rating || "N/A", // Default value for rating
        addedBy: action.payload.addedBy || "Unknown", // Default value for addedBy
      };
      state.favouriteMovies.push(movie);
    },
    setFavourites: (state, action) => {
      state.favouriteMovies = action.payload.map((movie) => ({
        movieId: movie.movieId || Math.random().toString(36).substring(7),
        title: movie.title || "Unknown Title",
        imageUrl: movie.imageUrl || "https://via.placeholder.com/150",
        rating: movie.rating || "N/A", 
        addedBy: movie.addedBy || "Unknown", 
      }));
    },
    removeFromFavourites: (state, action) => {
      state.favouriteMovies = state.favouriteMovies.filter( (movie) =>{
        return movie.movieId !== action.payload
      }
        
      );
    },
  },
});

export const { addToFavourites, setFavourites ,  removeFromFavourites} = movieSlice.actions;
