import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favorites: [],
  loading: false,
  error: null
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    fetchFavoritesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchFavoritesSuccess: (state, action) => {
      state.loading = false;
      state.favorites = action.payload;
      state.error = null;
    },
    fetchFavoritesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addFavoriteSuccess: (state, action) => {
      state.favorites.push(action.payload);
    },
    removeFavoriteSuccess: (state, action) => {
      state.favorites = state.favorites.filter(favorite => favorite.id !== action.payload);
    },
    clearFavoritesError: (state) => {
      state.error = null;
    }
  }
});

export const { 
  fetchFavoritesStart, 
  fetchFavoritesSuccess, 
  fetchFavoritesFailure, 
  addFavoriteSuccess,
  removeFavoriteSuccess,
  clearFavoritesError
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
