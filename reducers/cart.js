//FATOUMATA
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  artWorkInCart: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.items.push({
        id: action.payload.id,
        image: action.payload.image,
        title: action.payload.title,
        artist: action.payload.artist,
        distance: action.payload.distance,
      });
    },
    removeFromCart: (state, action) => {
      // Retire une oeuvre du panier par id
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
