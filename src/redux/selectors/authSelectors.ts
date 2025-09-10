import { RootState } from "../index"

export const selectIsLoggedIn = (state: RootState) => !!state.auth.accessToken
