// import React from "react";

// const Pagination = ({ currentPage, totalItems, itemsPerPage = 10, onPageChange }) => {
//   const totalPages = Math.ceil(totalItems / itemsPerPage);

//   if (!totalPages || totalPages === 0) return null;

//   const getPageNumbers = () => {
//     let pages = [];

//     if (totalPages <= 7) {
//       for (let i = 1; i <= totalPages; i++) pages.push(i);
//     } else {
//       if (currentPage <= 3) {
//         pages = [1, 2, 3, 4, "...", totalPages];
//       }
//       else if (currentPage >= totalPages - 2) {
//         pages = [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
//       }
//       else {
//         pages = [
//           1,
//           "...",
//           currentPage - 1,
//           currentPage,
//           currentPage + 1,
//           "...",
//           totalPages,
//         ];
//       }
//     }

//     return pages;
//   };

//   return (
//     <div className="flex items-center gap-2 mt-6 justify-center">

//       {/* Previous Button */}
//       <button
//         disabled={currentPage === 1}
//         onClick={() => onPageChange(currentPage - 1)}
//         className={`px-4 py-2 rounded-lg text-gray-600 border border-gray-300
//           ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
//       >
//         Prev
//       </button>

//       {/* Page Numbers */}
//       {getPageNumbers().map((page, index) => (
//         <button
//           key={index}
//           onClick={() => page !== "..." && onPageChange(page)}
//           disabled={page === "..."}
//           className={`
//             px-4 py-2 rounded-lg text-sm font-medium
//             transition-all duration-200

//             ${
//               page === currentPage
//                 ? "bg-amber-500 text-white shadow-md border border-amber-500"
//                 : page === "..."
//                 ? "cursor-default text-gray-500"
//                 : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
//             }
//           `}
//         >
//           {page}
//         </button>
//       ))}

//       {/* Next Button */}
//       <button
//         disabled={currentPage === totalPages}
//         onClick={() => onPageChange(currentPage + 1)}
//         className={`px-4 py-2 rounded-lg text-gray-600 border border-gray-300
//           ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
//       >
//         Next
//       </button>

//     </div>
//   );
// };

// export default Pagination;

import React from "react";

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  if (totalPages <= 1) return null;

  const generatePagination = () => {
    const pages = [];

    if (totalPages <= 5) {
      return [...Array(totalPages)].map((_, i) => i + 1);
    }

    let start = currentPage - 2;
    let end = currentPage + 2;

    if (start < 1) {
      start = 1;
      end = 5;
    }

    if (end > totalPages) {
      end = totalPages;
      start = totalPages - 4;
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePagination();

  return (
    <div className="flex justify-center mt-4 px-2">
      <nav className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 bg-white shadow-lg px-3 sm:px-4 py-2 sm:py-3 rounded-2xl max-w-full overflow-x-auto">
        {/* First - hidden on very small screens */}
        <button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className="hidden sm:block px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border text-xs sm:text-sm font-medium hover:bg-gray-100 disabled:opacity-40"
        >
          First
        </button>

        {/* Previous */}
        <button
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border text-xs sm:text-sm font-medium hover:bg-gray-100 disabled:opacity-40"
        >
          Prev
        </button>

        {pages.map((page, index) =>
          page === "..." ? (
            <span key={index} className="px-2 text-gray-500 text-xs sm:text-sm">
              ...
            </span>
          ) : (
            <button
              key={index}
              onClick={() => setCurrentPage(page)}
              className={`min-w-[28px] sm:min-w-[34px] h-[28px] sm:h-[34px] flex items-center justify-center rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold border
                ${
                  currentPage === page
                    ? "bg-[#FF6900] text-white shadow-md"
                    : "bg-white hover:bg-gray-100 text-gray-700"
                }`}
            >
              {page}
            </button>
          ),
        )}

        {/* Next */}
        <button
          onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border text-xs sm:text-sm font-medium hover:bg-gray-100 disabled:opacity-40"
        >
          Next
        </button>

        {/* Last - hidden on very small screens */}
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className="hidden sm:block px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border text-xs sm:text-sm font-medium hover:bg-gray-100 disabled:opacity-40"
        >
          Last
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
