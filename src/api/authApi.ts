import { toast } from "react-toastify";
import { apiSlice } from "./apiSlice"; // Импорт из нового файла
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
        }),
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
    // Добавь другие endpoints (userRegister, userVerification и т.д.) по аналогии
  }),
});

export const { useLoginMutation } = authApi;
