import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  type: "INDIVIDUAL_BASIC_COST",
  count: 0,
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
    clearSubscription: (state, action) => {
      state.type = initialState.type;
      state.count = initialState.count;
      state.price = initialState.price;
      state.subscriptionState = initialState.subscriptionState;
    },
  },
});

export const {
  setSubscriptionType,
  setSubscriptionCount,
  setSubscriptionPrice,
  setSubscriptionState,
  clearSubscription,
} = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
