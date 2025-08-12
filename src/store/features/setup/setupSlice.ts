import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Определение типов
interface Currency {
  id: string;
  currency_name: string;
  is_default: string; // Например, "Yes" или "No"
  //   [key: string]: any; // Дополнительные поля
}

interface Settings {
  currencies: Currency[];
  //   [key: string]: any; // Другие поля в settings, если есть
}

interface SettingsState {
  settings: Settings | undefined;
  activeCurrency: Currency | undefined;
}

const initialState: SettingsState = {
  settings: undefined,
  activeCurrency: undefined,
};

const setupSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    siteSettings: (state, action: PayloadAction<Settings>) => {
      state.settings = action.payload;
      state.activeCurrency =
        action.payload &&
        action.payload.currencies &&
        action.payload.currencies.length > 0
          ? action.payload.currencies.find(
              (item: Currency) => item.is_default === "Yes"
            )
          : undefined;
    },
    changeCurrency: (state, action: PayloadAction<Currency>) => {
      state.activeCurrency = action.payload;
    },
  },
});

export default setupSlice.reducer;
export const { siteSettings, changeCurrency } = setupSlice.actions;
