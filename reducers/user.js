import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    email: "",
    password: null,
    firstname: "",
    lastname: "",
    favoriteItems: [],
    hasSubcribed: false,
    authorisedLoans: 0,
    ongoingLoans: 0,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.email = action.payload.email;
      state.value.token = action.payload.token;
      state.value.firstname = action.payload.firstname;
      state.value.lastname = action.payload.lastname;
      state.value.favoriteItems = action.payload.favoriteItems;
      state.value.Subcribed = action.payload.Subcribed;
      state.value.authorisedLoans = action.payload.authorisedLoans;
      state.value.ongoingLoans = action.payload.ongoingLoans;
    },

    // addPlaces: (state, action) => {
    //   state.value.places = action.payload;
    // },
  },
});

export const { login } = userSlice.actions;
export default userSlice.reducer;
