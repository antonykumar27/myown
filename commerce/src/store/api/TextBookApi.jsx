import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const textBookApi = createApi({
  reducerPath: "textBookApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/textbooks`,
    prepareHeaders: (headers, { getState }) => {
      const state = getState();
      const token = state.auth?.user?.token || localStorage.getItem("token"); // Check both sources

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["TextBook"],

  endpoints: (builder) => ({
    getTextBooks: builder.query({
      query: () => "/",
      providesTags: ["TextBook"],
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
    }),

    getTextBook: builder.query({
      query: (id) => `/${id}`,
      providesTags: ["TextBook"],
    }),

    createTextBook: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["TextBook"],
    }),
    createTextContent: builder.mutation({
      query: (data) => ({
        url: "/textContent",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["TextBook"],
    }),
    updateTextBook: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["TextBook"],
    }),
    updateTextBookContent: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/textBookContent/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["TextBook"],
    }),

    getTextBookById: builder.query({
      query: (id) => `/${id}`,
      transformResponse: (response) => response.data,
      providesTags: ["TextBook"],
    }),
    getTextContentById: builder.query({
      query: (id) => `/textContent/${id}`,
      transformResponse: (response) => response.data,
      providesTags: ["TextBook"],
    }),
    getTextContentSpecificById: builder.query({
      query: (id) => `/textContentSpecific/${id}`,
      transformResponse: (response) => response,
      providesTags: ["TextBook"],
    }),
    getTextContentCount: builder.query({
      query: (id) => `/textContentCount/${id}`,
      transformResponse: (response) => response.data,
      providesTags: ["TextBook"],
    }),
    deleteTextBook: builder.mutation({
      query: (id) => {
        console.log("🟡 DELETE textbook id:", id);

        return {
          url: `delete/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["TextBook"],
    }),

    deleteTextContentPage: builder.mutation({
      query: ({ id }) => {
        console.log("🟡 DELETE pageId received:", id);

        return {
          url: `/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["TextBook"],
    }),
  }),
});

export const {
  useGetTextBooksQuery,
  useGetTextBookQuery,
  useGetTextBookByIdQuery,
  useGetTextContentByIdQuery,
  useGetTextContentSpecificByIdQuery,
  useUpdateTextBookContentMutation,
  useGetTextContentCountQuery,
  useCreateTextBookMutation,
  useCreateTextContentMutation,
  useUpdateTextBookMutation,
  useDeleteTextBookMutation,
  useDeleteTextContentPageMutation,
} = textBookApi;
