import { useEffect, useMemo } from "react";

type PaginationProps = {
  limit: number;
  grossCnt: number;
};

const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, i) => i + start);
};

const usePagination = ({ limit, grossCnt }: PaginationProps) => {
  useEffect(() => {
    if (grossCnt > 0)
      localStorage.setItem("grossCnt", JSON.stringify(grossCnt));
  }, [grossCnt]);

  const count = JSON.parse(localStorage.getItem("grossCnt") || "0");
  const total = Math.ceil(parseInt(count) / limit);

  const paginationRange = useMemo(() => {
    return range(1, total);
  }, [total]);

  return { paginationRange };
};

export default usePagination;
