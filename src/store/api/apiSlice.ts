// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// const baseQuery = fetchBaseQuery({
//   baseUrl: `${process.env.BASE_URL}api/`,
//   tagTypes: ["cartData", "orderData"],
//   headers: {
//     "X-Requested-With": "XMLHttpRequest",
//   },
//   prepareHeaders: (headers, { getState }) => {
//     const token = getState().auth.accessToken;
//     if (token) {
//       headers.set("authorization", `Bearer ${token}`);
//     }
//   },
// });

// export const apiSlice = createApi({
//   reducerPath: "api",
//   baseQuery,
//   endpoints: (builder) => ({}),
// });
import { toast } from "react-toastify";
import { apiSlice } from "../api/apiSlice"; // Проверь путь
import { userLoggedIn, userLoggedOut } from "../features/auth/authSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data: { email: string; password: string }) => ({
        url: "store-login",
        method: "POST",
        body: new URLSearchParams({
          email: data.email,
          password: data.password,
        }), // Простая форма
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        const id = toast.loading("Please Wait...", {
          position: "top-right",
          closeButton: true,
        });
        try {
          const { data } = await queryFulfilled;
          if (data.access_token) {
            localStorage.setItem(
              "auth",
              JSON.stringify({
                accessToken: data.access_token,
                expiresIn: data.expires_in,
                user: data.user,
              })
            );
            dispatch(
              userLoggedIn({
                accessToken: data.access_token,
                expiresIn: data.expires_in,
                user: data.user,
              })
            );
            toast.update(id, {
              render: "Login Successfully",
              type: "success",
              isLoading: false,
              autoClose: 2000,
            });
          }
        } catch (error) {
          toast.update(id, {
            render: error.data?.message || "Error occurred!",
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
        }
      },
    }),
    // Аналогично для других endpoints (userRegister, userVerification и т.д.)
  }),
});

export const { useLoginMutation } = authApi; // Добавь другие хуки по необходимости
