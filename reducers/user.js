import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    email: null,
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
      //FATOUMATA
      // state.value.email = action.payload.email;
      // state.value.token = action.payload.token;
      // state.value.firstname = action.payload.firstname;
      // state.value.lastname = action.payload.lastname;
      // state.value.favoriteItems = action.payload.favoriteItems;
      // state.value.hasSubcribed = action.payload.hasSubcribed;
      // state.value.authorisedLoans = action.payload.authorisedLoans;
      // state.value.ongoingLoans = action.payload.ongoingLoans;

      //PROPOSITON CLAIRE
      Object.assign(state.value, action.payload);
      //dès qu'une propriété sera envoyée à l'inscription/la connexion, elle sera ajoutée à l'état mais si pas d'info c'est la valeur par défaut qui sera gardée
      // et du coup on peut aussi appeler cette action "loginAndUpdate" car quand on fera des changement dans le profil, on pourra aussi l'utiliser
    },
    //CLAIRE
    addPosition: (state, action) => {
      state.value.position = action.payload;
    },
    //CLAIRE
    logout: (state) => {
      state.value = initialState.value;
    },
  },
});

export const { loginAndUpdate, addPosition, logout } = userSlice.actions;
export default userSlice.reducer;
