import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dailyTaskApi = createApi({
  reducerPath: "dailyTaskApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/dailyTask`,

    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token || localStorage.getItem("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["DailyTask"],
  endpoints: (builder) => ({
    getTodayTasks: builder.query({
      query: () => "/daily-tasks/today",
      providesTags: ["DailyTask"],
    }),

    getDailyTasks: builder.query({
      query: (date) => `/daily-tasks?date=${date}`,
      providesTags: ["DailyTask"],
    }),

    createDailyTask: builder.mutation({
      query: (task) => ({
        url: "/daily-tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["DailyTask"],
    }),

    updateDailyTask: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/daily-tasks/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["DailyTask"],
    }),

    toggleDailyTask: builder.mutation({
      query: (id) => ({
        url: `/daily-tasks/${id}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: ["DailyTask"],
    }),

    deleteDailyTask: builder.mutation({
      query: (id) => ({
        url: `/daily-tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DailyTask"],
    }),
  }),
});

export const {
  useGetTodayTasksQuery,
  useGetDailyTasksQuery,
  useCreateDailyTaskMutation,
  useUpdateDailyTaskMutation,
  useToggleDailyTaskMutation,
  useDeleteDailyTaskMutation,
} = dailyTaskApi;
