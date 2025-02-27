import React from "react";
import classnames from "classnames";
import { usePagination, DOTS } from "./usePagination";
import "./pagination.scss";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Pagination = (props) => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 0,
    currentPage,
    pageSize,
    className,
  } = props;

  const paginationRange =
    usePagination({
      currentPage,
      totalCount,
      siblingCount,
      pageSize,
    }) || [];

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];
  return (
    <ul
      className={classnames("pagination-container  ", {
        [className]: className,
      })}
    >
      <li
        className={classnames("pagination-item ", {
          disabled: currentPage === 1,
        })}
        onClick={onPrevious}
      >
        {/* <div className="arrow left" /> */}
        <Button className="rounded-full p-0" variant="ghost">
          {" "}
          <ChevronLeft className="dark:text-white" size={16} />
        </Button>
      </li>
      {paginationRange.map((pageNumber) => {
        if (pageNumber === DOTS) {
          return (
            <li className="pagination-item dots dark:text-white">&#8230;</li>
          );
        }

        return (
          <li
            className={classnames("pagination-item dark:text-white", {
              selected: pageNumber === currentPage,
            })}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </li>
        );
      })}
      <li
        className={classnames("pagination-item", {
          disabled: currentPage === lastPage,
        })}
        onClick={onNext}
      >
        {/* <div className="arrow right" /> */}
        <Button className="rounded-full p-0" variant="ghost">
          {" "}
          <ChevronRight className="dark:text-white" size={16} />
        </Button>
      </li>
    </ul>
  );
};

export default Pagination;
