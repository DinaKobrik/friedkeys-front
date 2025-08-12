// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./features/auth/authSlice";
// import { apiSlice } from "./api/apiSlice";
// import setupSlice from "./features/setup/setupSlice";
// import paginationReducer from "./features/pagination/paginationSlice";
// import { rtkQueryErrorLogger } from "./api/middleware";

// export const store = configureStore({
//   reducer: {
//     [apiSlice.reducerPath]: apiSlice.reducer,
//     auth: authReducer,
//     defaultSettings: setupSlice,
//     pagination: paginationReducer,

//   },
//   middleware: (getDefaultMiddlewares) =>
//     getDefaultMiddlewares().concat(apiSlice.middleware, rtkQueryErrorLogger),
// });
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import { apiSlice } from "./api/apiSlice";
import setupSlice from "./features/setup/setupSlice";
import paginationReducer from "./features/pagination/paginationSlice";
import { rtkQueryErrorLogger } from "./api/middleware";

// Типы состояний редьюсеров
interface AuthState {
  accessToken: string | undefined;
  tokenExpire: string | undefined;
  user: unknown | undefined; // Замени any на конкретный тип, если знаешь структуру
}

interface SettingsState {
  settings:
    | {
        currencies: { id: string; currency_name: string; is_default: string }[];
      }
    | undefined;
  activeCurrency:
    | { id: string; currency_name: string; is_default: string }
    | undefined;
}

interface PaginationState {
  sellerProductPage: number;
  ordersPage: number;
  user: unknown | undefined; // Замени any на конкретный тип
}

// Тип корневого состояния
export type RootState = {
  [apiSlice.reducerPath]: ReturnType<typeof apiSlice.reducer>;
  auth: AuthState;
  setup: SettingsState;
  pagination: PaginationState;
};

// Тип диспетчера
export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    setup: setupSlice,
    pagination: paginationReducer,
  },
  middleware: (getDefaultMiddlewares) =>
    getDefaultMiddlewares().concat(apiSlice.middleware, rtkQueryErrorLogger),
});
