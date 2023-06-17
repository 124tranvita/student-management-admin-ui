import { useMemo } from "react";

type PaginationProps = {
  limit: number;
  grossCnt: number;
};

const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, i) => i + start);
};

const usePagination = ({ limit, grossCnt }: PaginationProps) => {
  const total = Math.ceil(grossCnt / limit);

  const paginationRange = useMemo(() => {
    return range(1, total);
  }, [total]);

  return { paginationRange };
};

export default usePagination;
