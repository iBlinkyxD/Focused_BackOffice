import React, { useCallback, useContext, useEffect, useState } from "react";
import Styles from "./AdminDashboardPage.module.css";
import UserList from "../components/admin_dashboard/UserList";
import AuthContext from "../context/AuthProvider";
import { getAllUser } from "../services/UserService";

export default function AdminDashboardPage() {
  const { sessionToken } = useContext(AuthContext);
  const [usersData, setUsersData] = useState([]); // Properly initialized state

  const fetchData = useCallback(async () => {
    try {
      const data = await getAllUser(sessionToken);
      setUsersData(data); // Update state with fetched data
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  }, [sessionToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className={Styles.main_container}>
      <h1 className={Styles.title}>User List</h1>
      <UserList data={usersData} refetchData={fetchData}/>
    </div>
  );
}
