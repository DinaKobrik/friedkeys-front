import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "https://your-api-base-url.com" }), // Замени на URL твоего API
  endpoints: (builder) => ({}), // Пустой объект, будет расширяться в authApi
});

export default apiSlice;
