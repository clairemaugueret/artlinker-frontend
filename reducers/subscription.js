import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  type: "INDIVIDUAL_BASIC_COST",
  count: 1, // nombre d'œuvres sélectionné par défaut
  price: 100, // prix par défaut (correspondant à 1 oeuvre pour Particulier)
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setSubscriptionType: (state, action) => {
      state.type = action.payload;
    },
    setSubscriptionCount: (state, action) => {
      state.count = action.payload;
    },
    setSubscriptionPrice: (state, action) => {
      state.price = action.payload;
    },
  },
});

export const {
  setSubscriptionType,
  setSubscriptionCount,
  setSubscriptionPrice,
} = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
