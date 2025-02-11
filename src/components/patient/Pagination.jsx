import React from "react";
import Styles from "./Pagination.module.css";

export default function Pagination({ currentPage, totalPages, paginate }) {
  const pageNumbers = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    if (currentPage <= 3) {
      pageNumbers.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pageNumbers.push(
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    } else {
      pageNumbers.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
      );
    }
  }

  return (
    <div className={Styles.pagination}>
      <div className={Styles.previous}>
        <button
          onClick={() => paginate(currentPage - 1)}
          className={Styles.nextPreButton}
          disabled={currentPage === 1 || totalPages === 0}
        >
          {"<"}
        </button>
      </div>
      <div className={Styles.page}>
        {pageNumbers.map((number, index) => (
          <button
            key={index}
            onClick={() => typeof number === "number" && paginate(number)}
            className={
              number === currentPage
                ? Styles.activePage
                : number === "..."
                ? Styles.ellipsis
                : Styles.paginationButton
            }
            disabled={number === "..."}
          >
            {number}
          </button>
        ))}
      </div>
      <div className={Styles.next}>
        <button
          onClick={() => paginate(currentPage + 1)}
          className={Styles.nextPreButton}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          {">"}
        </button>
      </div>
    </div>
  );
}