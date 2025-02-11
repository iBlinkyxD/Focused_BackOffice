import React from 'react'
import AdminNavbar from "../components/AdminNavbar";
import { Outlet } from 'react-router-dom'; 

export default function MainLayout() {
  return (
    <>
        <AdminNavbar />
        <Outlet />
    </>
  )
}