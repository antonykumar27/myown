import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/`, // Your backend base URL

    prepareHeaders: (headers, { getState }) => {
      const state = getState();
      const token = state.auth?.user?.token || localStorage.getItem("token"); // Check both sources
      console.log("token", token); // Log the token for debugging
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    // Fetch all users
    getUsers: builder.query({
      query: () => "/users", // Adjust the URL path as per your backend
    }),

    // Fetch a specific user by ID
    getUserById: builder.query({
      query: (id) => `/users/${id}`, // Fetch by specific ID
    }),

    // Create a new user
    createUser: builder.mutation({
      query: (newUser) => ({
        url: "/users", // URL for creating a new user
        method: "POST",
        body: newUser,
      }),
    }),

    // Update an existing user by ID
    updateUser: builder.mutation({
      query: ({ userId, ...updatedData }) => ({
        url: `/users/${userId}`, // Update using userId
        method: "PUT",
        body: updatedData,
      }),
    }),

    // Delete a user by ID
    deleteUser: builder.mutation({
      query: (userId) => {
        return {
          url: `/users/${userId}`, // URL for deleting the user
          method: "DELETE",
        };
      },
    }),

    // Additional endpoint for user login (optional)
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login", // Assuming login is handled under auth endpoint
        method: "POST",
        body: credentials,
      }),
    }),

    // Additional endpoint for user registration (optional)
    registerUser: builder.mutation({
      query: (newUser) => ({
        url: "/auth/register", // Assuming registration is handled under auth endpoint
        method: "POST",
        body: newUser,
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useLoginUserMutation,
  useRegisterUserMutation,
} = userApi;
