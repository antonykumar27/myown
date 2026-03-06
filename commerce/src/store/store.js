import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { userApi } from "../store/api/userApi";
import { textBookApi } from "../store/api/TextBookApi";
import { taskApi } from "../store/api/TaskApi";
import { dailyTaskApi } from "../store/api/DailyTaskApi";
import { projectApi } from "../store/api/ProjectApi";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [textBookApi.reducerPath]: textBookApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
    [dailyTaskApi.reducerPath]: dailyTaskApi.reducer,
    [projectApi.reducerPath]: projectApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(textBookApi.middleware)
      .concat(taskApi.middleware)
      .concat(dailyTaskApi.middleware)
      .concat(projectApi.middleware),
  devTools: true, // Enable Redux DevTools
});

setupListeners(store.dispatch);

export default store;
