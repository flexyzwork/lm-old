// // src/state/authSlice.ts
// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface AuthState {
//   user: User | null;
//   accessToken: string | null;
// }

// const initialState: AuthState = {
//   user: null,
//   accessToken: null,
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setUser: (state, action: PayloadAction<AuthState['user']>) => {
//       state.user = action.payload;
//     },
//     login: (state, action: PayloadAction<{ user: AuthState['user']; token: string }>) => {
//       state.user = action.payload.user;
//       state.accessToken = action.payload.token;
//     },
//     logout: (state) => {
//       state.user = null;
//       state.accessToken = null;
//     },
//   },
// });

// export const { login, logout, setUser } = authSlice.actions;

// export default authSlice.reducer;
