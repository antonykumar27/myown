import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const projectApi = createApi({
  reducerPath: "projectApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/project`,

    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token || localStorage.getItem("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Project"],
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: () => "/projects",
      providesTags: ["Project"],
    }),

    getProject: builder.query({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, id) => [{ type: "Project", id }],
    }),

    createProject: builder.mutation({
      query: (project) => ({
        url: "/projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["Project"],
    }),

    updateProject: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/projects/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Project", id }],
    }),

    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Project"],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectApi;
