import "react-toastify/dist/ReactToastify.css";
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import ProtectedRoute from "./common/ProtectRoutes";
import CommonLayouts from "./common/CommonLayouts";
import CommonLayoutOutlet from "./common/CommonLayoutOutlet";
import AdminIndex from "./common/AdminIndex";
import { SocketProvider } from "./common/Socket";
import TextBookCreateWithSomeLogic from "./textBook/TextBookCreateWithSomeLogic";
import EcahTextBookPage from "./textBook/EcahTextBookPage";
import ContentCreate from "./textBook/contentCreate";
import ContentDisplay from "./textBook/ContentDisplay";
import Dashboard from "./task/Dashboard";
import Projects from "./task/Projects";
import Tasks from "./task/Tasks";
import Calendar from "./task/Calendar";
import Notes from "./task/Notes";
import Settings from "./task/Settings";
import ContentEdit from "./textBook/ContentEdit";
const Loader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);
const Authentication = lazy(() => import("./authentication/Authentication"));

function App() {
  return (
    <>
      <SocketProvider>
        <Router>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Authentication />} />

              <Route path="/login" element={<Authentication />} />
              <Route path="/register" element={<Authentication />} />

              <Route
                path="/adminSelf"
                element={
                  <ProtectedRoute>
                    <CommonLayouts />
                  </ProtectedRoute>
                }
              >
                <Route element={<CommonLayoutOutlet />}>
                  <Route index element={<TextBookCreateWithSomeLogic />} />
                  <Route
                    path="createContent/:id"
                    element={<EcahTextBookPage />}
                  />
                  <Route
                    path="createContentPage/:id"
                    element={<ContentCreate />}
                  />
                  <Route
                    path="displayContentPage/:id"
                    element={<ContentDisplay />}
                  />
                  <Route path="contentEdit/:id" element={<ContentEdit />} />
                  {/* "  //////////////////task details/////////////" */}
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="projects" element={<Projects />} />
                  <Route path="tasks" element={<Tasks />} />
                  <Route path="calendar" element={<Calendar />} />
                  <Route path="notes" element={<Notes />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
          <ToastContainer
            position="top-right"
            autoClose={1500}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
            theme="colored"
          />
        </Router>
      </SocketProvider>
    </>
  );
}

export default App;
