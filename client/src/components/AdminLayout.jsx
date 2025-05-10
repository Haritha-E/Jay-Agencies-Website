import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar"; 

const AdminLayout = ({ onLogout }) => {
  return (
    <>
      <AdminNavbar onLogout={onLogout} />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default AdminLayout;
