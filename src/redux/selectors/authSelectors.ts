import { RootState } from "../index"

export const selectIsLoggedIn = (state: RootState) => !!state.auth.accessToken
export const selectUser = (state: RootState) => state.auth.user;