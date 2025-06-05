import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    email: null,
    token: null,
    firstname: null,
    lastname: null,
    favoriteItems: [],
    hasSubscribed: false,
    authorisedLoans: 0,
    ongoingLoans: 0,
    position: null,
    reminderUpcomingEndLoans: [],
    reminderExpiredLoans: [],
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginAndUpdate: (state, action) => {
      for (const key in action.payload) {
        if (action.payload[key] !== undefined) {
          state.value[key] = action.payload[key];
        }
      }
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
      state.value.hasSubscribed = true;
      state.value.authorisedLoans = action.payload.authorisedLoans;
    },
    setReminderUpcomingEndLoan: (state, action) => {
      action.payload.forEach((item) =>
        state.value.reminderUpcomingEndLoans.push(item)
      );
    },
    setReminderExpiredLoan: (state, action) => {
      action.payload.forEach((item) =>
        state.value.reminderExpiredLoans.push(item)
      );
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
  setReminderUpcomingEndLoan,
  setReminderExpiredLoan,
} = userSlice.actions;
export default userSlice.reducer;
