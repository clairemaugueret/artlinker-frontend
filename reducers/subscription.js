import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  type: "INDIVIDUAL_BASIC_COST",
  count: 1,
  price: 100,
  subscriptionState: false, // <-- nouvel état temporaire
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
    setSubscriptionState: (state, action) => {
      state.subscriptionState = action.payload;
    },
  },
});

export const {
  setSubscriptionType,
  setSubscriptionCount,
  setSubscriptionPrice,
  setSubscriptionState,
} = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
