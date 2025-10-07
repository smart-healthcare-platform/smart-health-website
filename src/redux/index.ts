import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import bookingReducer from "./slices/bookingSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const bookingPersistConfig = {
  key: "booking",
  storage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  booking: persistReducer(bookingPersistConfig, bookingReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
