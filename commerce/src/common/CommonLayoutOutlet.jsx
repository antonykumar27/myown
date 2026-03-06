import { Outlet } from "react-router-dom";

function CommonLayoutOutlet() {
  return (
    <div className="flex flex-col w-full h-screen">
      {/* <SecretoryHeader /> */}
      {/* 👇 Content that fills remaining height after header */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default CommonLayoutOutlet;
