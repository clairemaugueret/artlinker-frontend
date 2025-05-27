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
      state.artWorkInCart.push({
        id: action.payload.id,
        image: action.payload.image,
        title: action.payload.title,
        artist: action.payload.artist,
        distance: action.payload.distance,
      });
    },
    removeFromCart: (state, action) => {
      // Retire une oeuvre du panier par id
      state.artWorkInCart = state.artWorkInCart.filter(
        (item) => item.id !== action.payload.id
      );
    },
    clearCart: (state) => {
      state.artWorkInCart = initialState.artWorkInCart; // Réinitialise le panier
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
