import React from "react";

type PaginationProps = {
  paginationRange: number[];
  currentPage: number;
  handlePaging: (value: number) => void;
};
export const Pagination: React.FC<PaginationProps> = ({
  paginationRange,
  handlePaging,
  currentPage,
}) => {
  return (
    <div className="flex items-center justify-center py-10 lg:px-0 sm:px-6 px-4">
      <div className="lg:w-3/5 w-full  flex items-center justify-between border-t border-gray-200">
        <button
          className="flex items-center pt-3 text-gray-600 hover:text-indigo-700 cursor-pointer"
          disabled={currentPage === 1}
          onClick={() => handlePaging(currentPage - 1)}
        >
          <svg
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.1665 4H12.8332"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1.1665 4L4.49984 7.33333"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1.1665 4.00002L4.49984 0.666687"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-sm ml-3 font-medium leading-none ">Previous</p>
        </button>
        <div className="sm:flex hidden">
          {paginationRange &&
            paginationRange.length > 0 &&
            paginationRange.map((item) => (
              <button
                key={item}
                className={`${
                  currentPage === item
                    ? "text-indigo-700 border-indigo-400"
                    : ""
                }text-sm font-medium leading-none cursor-pointer text-gray-600 hover:text-indigo-700 border-t border-transparent hover:border-indigo-400 pt-3 mr-4 px-2`}
                onClick={() => handlePaging(item)}
                disabled={currentPage === item}
              >
                {item}
              </button>
            ))}
        </div>
        <button
          className="flex items-center pt-3 text-gray-600 hover:text-indigo-700 cursor-pointer"
          disabled={currentPage === paginationRange.length}
          onClick={() => handlePaging(currentPage + 1)}
        >
          <p className="text-sm font-medium leading-none mr-3">Next</p>
          <svg
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.1665 4H12.8332"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.5 7.33333L12.8333 4"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.5 0.666687L12.8333 4.00002"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
