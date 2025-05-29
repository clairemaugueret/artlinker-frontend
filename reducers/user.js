import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    email: null,
    token: null,
    password: null,
    firstname: null,
    lastname: null,
    favoriteItems: [],
    hasSubcribed: false,
    authorisedLoans: 0,
    ongoingLoans: 0,
    position: null,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginAndUpdate: (state, action) => {
      Object.assign(state.value, action.payload);
      //dès qu'une propriété sera envoyée à l'inscription/la connexion, elle sera ajoutée à l'état mais si pas d'info c'est la valeur par défaut qui sera gardée
      // et du coup on peut aussi appeler cette action "loginAndUpdate" car quand on fera des changement dans le profil, on pourra aussi l'utiliser
    },
    addPosition: (state, action) => {
      state.value.position = action.payload;
    },
    updateOnGoingLoans: (state, action) => {
      state.value.ongoingLoans = action.payload;
    },
    updateSubscription: (state, action) => {
      state.value.hasSubcribed = true;
      state.value.ongoingLoans = action.payload;
    },
    logout: (state) => {
      state.value = initialState.value;
    },
  },
});

export const {
  loginAndUpdate,
  addPosition,
  logout,
  updateOnGoingLoans,
  updateSubscription,
} = userSlice.actions;
export default userSlice.reducer;
