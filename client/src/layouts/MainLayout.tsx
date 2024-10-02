import React from "react";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import "./mainLayout.scss";
import { Provider } from "react-redux";
import { store } from "../store/store";

const MainLayout = () => {
  return (
    <div className="app">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="content">
          <Provider store={store}>
            <Outlet />
          </Provider>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
