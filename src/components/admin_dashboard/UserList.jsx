import React, { useState, useEffect } from "react";
import Styles from "../admin_dashboard/UserList.module.css";
import Pagination from "../patient/Pagination";
import UserEdit from "./UserEdit";

// Role mapping for readability
const roleMap = {
  0: "Administrator",
  1: "Patient",
  3: "Psychiatrist",
  2: "Psychologist",
};

export default function UserList({ data, refetchData }) {
  const [users, setUsers] = useState([]); // State for user data
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [selectedUser, setSelectedUser] = useState(null); // Track selected user
  const [modal, setModal] = useState(false);

  const itemsPerPage = 10; // Items per page

  // State to manage sorting
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    if (Array.isArray(data)) {
      setUsers(data);
    }
  }, [data]);

  // Sorting logic
  const sortUsers = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...users].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setUsers(sortedData);
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? " ↑" : " ↓";
    }
    return "";
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(users.length / itemsPerPage);

  const toggleEditModal = (user) => {
    setSelectedUser(user);
    setModal(!modal);
  };

  // Calculate empty rows to fill up the table
  const emptyRowsCount = itemsPerPage - currentUsers.length;

  return (
    <div className={Styles.box}>
      {/* User Table */}
      <div className={Styles.table_container}>
        <table className={Styles.medication_table}>
          <thead>
            <tr>
              <th onClick={() => sortUsers("id")}>
                ID {getSortIndicator("id")}
              </th>
              <th onClick={() => sortUsers("email")}>
                Email {getSortIndicator("email")}
              </th>
              <th onClick={() => sortUsers("id_rol")}>
                Role {getSortIndicator("id_rol")}
              </th>
              <th onClick={() => sortUsers("verified")}>
                Verified {getSortIndicator("verified")}
              </th>
              <th onClick={() => sortUsers("active")}>
                Status {getSortIndicator("active")}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr
                key={user.id}
                className={Styles.clickableRow}
                onClick={() => toggleEditModal(user)} // Open modal on row click
              >
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{roleMap[user.id_rol] || "Unknown"}</td>
                <td>{user.verified ? "Yes" : "No"}</td>
                <td
                  className={
                    user.active ? Styles.activeStatus : Styles.disableStatus
                  }
                >
                  {user.active ? "Active" : "Inactive"}
                </td>
              </tr>
            ))}

            {/* Render empty rows to fill up the table */}
            {Array.from({ length: emptyRowsCount }).map((_, index) => (
              <tr key={`empty-${index}`} className={Styles.emptyRow}>
                <td colSpan={6} style={{ height: "40px" }}></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={paginate}
      />

      {/* Modal Component */}
      <UserEdit
        modal={modal}
        user={selectedUser}
        toggleModal={toggleEditModal}
        refetchData={refetchData}
      />
    </div>
  );
}
