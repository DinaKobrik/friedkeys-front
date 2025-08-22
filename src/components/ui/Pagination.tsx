import React from "react";
import Button from "./Button";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  handlePageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  handlePageChange,
}) => {
  return (
    <>
      {totalPages > 1 && (
        <div className="w-full grid justify-items-center justify-center items-center grid-cols-[repeat(auto-fit,40px)] sm:grid-cols-[repeat(auto-fit,75px)] gap-[18px] my-0 mx-auto">
          {totalPages > 5 &&
            (currentPage === 1 ? (
              <>
                <Button variant="secondary" onClick={() => handlePageChange(1)}>
                  1
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(2)}
                  className="border-none">
                  2
                </Button>
                <span className="font-usuzi-condensed text-[17px] leading-[19px] sm:text-[26px] sm:leading-[28px] font-bold uppercase text-center text-white">
                  . . .
                </span>
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(totalPages)}
                  className="border-none">
                  {totalPages}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(currentPage + 1)}>
                  &gt;
                </Button>
              </>
            ) : currentPage === totalPages ? (
              <>
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(currentPage - 1)}>
                  &lt;
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(1)}
                  className="border-none">
                  1
                </Button>
                <span className="font-usuzi-condensed text-[17px] leading-[19px] sm:text-[26px] sm:leading-[28px] font-bold uppercase text-center text-white">
                  . . .
                </span>
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(totalPages - 1)}
                  className="border-none">
                  {totalPages - 1}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(totalPages)}>
                  {totalPages}
                </Button>
              </>
            ) : currentPage === totalPages - 1 ? (
              <>
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(currentPage - 1)}>
                  &lt;
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(1)}
                  className="border-none">
                  1
                </Button>
                <span className="font-usuzi-condensed text-[17px] leading-[19px] sm:text-[26px] sm:leading-[28px] font-bold uppercase text-center text-white">
                  . . .
                </span>
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(totalPages - 1)}>
                  {totalPages - 1}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(totalPages)}
                  className="border-none">
                  {totalPages}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(currentPage - 1)}>
                  &lt;
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(currentPage)}>
                  {currentPage}
                </Button>
                <span className="font-usuzi-condensed text-[17px] leading-[19px] sm:text-[26px] sm:leading-[28px] font-bold uppercase text-center text-white">
                  . . .
                </span>
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(totalPages)}
                  className="border-none">
                  {totalPages}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(currentPage + 1)}>
                  &gt;
                </Button>
              </>
            ))}
          {totalPages <= 5 &&
            Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant="secondary"
                onClick={() => handlePageChange(page)}
                className={`${currentPage === page ? "" : "border-none"}`}>
                {page}
              </Button>
            ))}
        </div>
      )}
    </>
  );
};

export default Pagination;
