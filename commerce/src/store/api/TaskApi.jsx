import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const taskApi = createApi({
  reducerPath: "taskApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1`,

    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token || localStorage.getItem("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: ["Task", "Note"],

  endpoints: (builder) => ({
    // ---------------- TASKS ----------------

    getTasks: builder.query({
      query: (params) => ({
        url: "/task/tasks",
        params,
      }),
      providesTags: ["Task"],
    }),

    getTask: builder.query({
      query: (id) => `/task/tasks/${id}`,
      providesTags: (result, error, id) => [{ type: "Task", id }],
    }),

    createTask: builder.mutation({
      query: (task) => ({
        url: "/task/tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Task"],
    }),

    updateTask: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/task/tasks/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Task", id }],
    }),

    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/task/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task"],
    }),

    updateTaskStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/task/tasks/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Task", id }],
    }),

    bulkUpdateTasks: builder.mutation({
      query: (updates) => ({
        url: "/task/tasks/bulk-update",
        method: "POST",
        body: updates,
      }),
      invalidatesTags: ["Task"],
    }),

    // ---------------- NOTES ----------------

    getNotes: builder.query({
      query: () => "/notes",
      providesTags: ["Note"],
    }),

    createNote: builder.mutation({
      query: (note) => ({
        url: "/notes",
        method: "POST",
        body: note,
      }),
      invalidatesTags: ["Note"],
    }),

    deleteNote: builder.mutation({
      query: (id) => ({
        url: `/notes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Note"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskStatusMutation,
  useBulkUpdateTasksMutation,

  // NOTES
  useGetNotesQuery,
  useCreateNoteMutation,
  useDeleteNoteMutation,
} = taskApi;
