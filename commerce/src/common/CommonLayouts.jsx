import { Outlet } from "react-router-dom";

import CommonLayoutsSidebar from "./CommonSidebar";
import QuizeSideBarMobile from "./CommonSidebarMobile";
import CommonMobileTopBar from "./CommonMobileTopBar";

const CommonLayouts = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <div className="w-full h-screen md:flex overflow-hidden">
      {/* Top bar */}
      <CommonMobileTopBar />

      {/* Mobile sidebar */}
      <QuizeSideBarMobile
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Desktop sidebar */}
      <CommonLayoutsSidebar />

      {/* Main content area – NO SCROLL HERE */}
      <section className={`flex flex-1 overflow-hidden `}>
        <Outlet />
      </section>
    </div>
  );
};

export default CommonLayouts;
